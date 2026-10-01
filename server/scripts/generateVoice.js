// ---------------------------------------------------------------
// generateVoice.js — one-time voice-over generation with Sarvam.
//
//   npm run voice                      all lessons, all versions, ta + en
//   npm run voice -- --lesson probability --version B --lang ta
//   npm run voice -- --dry             show what would be generated + characters
//   npm run voice -- --force           regenerate everything
//
// Reads  client/src/lessons/<lesson>/narration.json
// Writes client/public/audio/<lesson>/<version>/<lang>/<beatId>.mp3
// Keeps  client/public/audio/<lesson>/manifest.json so unchanged lines are
//        skipped. Edit one sentence → only that clip is regenerated.
// The API key stays on this machine. It is never shipped to the browser.
// ---------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const ROOT = path.join(__dirname, '..', '..');
const LESSONS_DIR = path.join(ROOT, 'client', 'src', 'lessons');
const AUDIO_DIR = path.join(ROOT, 'client', 'public', 'audio');

const KEY = process.env.SARVAM_API_KEY || process.env.SARVAM_KEY || process.env.SARVAM_API_SUBSCRIPTION_KEY;
const BASE = process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai';

const args = process.argv.slice(2);
const arg = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes('--' + name);

const CONFIG = {
  model: 'bulbul:v3',
  speaker: (arg('speaker') || process.env.VOICE_SPEAKER || 'kavitha').toLowerCase(),
  pace: Number(arg('pace') || process.env.VOICE_PACE || 0.92),
  temperature: Number(process.env.VOICE_TEMPERATURE || 0.5),
  sampleRate: Number(process.env.VOICE_SAMPLE_RATE || 22050),
  codec: 'mp3',
};
const LANG_CODE = { ta: 'ta-IN', en: 'en-IN' };

// Symbols read badly aloud. `say` fields handle the hard cases; this catches the rest.
function speakable(text, lang) {
  return text
    .replace(/(\d)\s*%/g, '$1 percent')
    .replace(/÷/g, lang === 'ta' ? ' வகுத்தல் ' : ' divided by ')
    .replace(/×/g, lang === 'ta' ? ' into ' : ' times ')
    .replace(/≈/g, lang === 'ta' ? ' சுமார் ' : ' about ')
    .replace(/→/g, ', ')
    // TTS reads "sin" as the English word (as in "sin and virtue");
    // mathematicians say "sine". Stop-gap until human voice recording.
    // Clips are hash-checked on this spoken text, so only lines that
    // contain "sin" regenerate.
    .replace(/\bsin\b/g, 'sine')
    .replace(/\s+/g, ' ')
    .trim();
}

function jobsFor(lessonId) {
  const file = path.join(LESSONS_DIR, lessonId, 'narration.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const jobs = [];
  for (const [v, ver] of Object.entries(data.versions)) {
    if (arg('version') && arg('version') !== v) continue;
    for (const scene of ver.scenes) for (const beat of scene.beats) for (const lang of ['ta', 'en']) {
      if (arg('lang') && arg('lang') !== lang) continue;
      const text = speakable((beat.say && beat.say[lang]) || beat[lang], lang);
      const rel = `${v}/${lang}/${beat.id}.mp3`;
      const hash = crypto.createHash('sha1').update(JSON.stringify([text, CONFIG, LANG_CODE[lang]])).digest('hex').slice(0, 16);
      jobs.push({ lessonId, rel, lang, text, hash });
    }
  }
  return jobs;
}

async function tts(text, lang) {
  const body = {
    text, language_code: LANG_CODE[lang], model: CONFIG.model, speaker: CONFIG.speaker,
    pace: CONFIG.pace, temperature: CONFIG.temperature, speech_sample_rate: CONFIG.sampleRate, output_audio_codec: CONFIG.codec,
  };
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`${BASE}/text-to-speech`, {
      method: 'POST', headers: { 'api-subscription-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (res.ok) {
      const json = await res.json();
      if (!json.audios?.length) throw new Error('No audio in response');
      return Buffer.from(json.audios.join(''), 'base64');
    }
    const detail = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 4) { await new Promise((r) => setTimeout(r, 1500 * attempt)); continue; }
    if (res.status === 403) throw new Error('403 Forbidden: check the Sarvam key in server/.env');
    throw new Error(`HTTP ${res.status}: ${detail.slice(0, 300)}`);
  }
}

async function main() {
  const [major] = process.versions.node.split('.').map(Number);
  if (major < 18) { console.error('Node 18 or newer is needed (built-in fetch).'); process.exit(1); }

  const lessonIds = arg('lesson') ? [arg('lesson')] : fs.readdirSync(LESSONS_DIR).filter((d) => fs.existsSync(path.join(LESSONS_DIR, d, 'narration.json')));
  console.log(`Voice: ${CONFIG.speaker}, pace ${CONFIG.pace}, ${CONFIG.model}, ${CONFIG.codec}`);

  let made = 0, skipped = 0, failed = 0, chars = 0;
  for (const lessonId of lessonIds) {
    const outDir = path.join(AUDIO_DIR, lessonId);
    const manifestFile = path.join(outDir, 'manifest.json');
    const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};
    const jobs = jobsFor(lessonId);
    const todo = jobs.filter((j) => flag('force') || manifest[j.rel]?.hash !== j.hash || !fs.existsSync(path.join(outDir, j.rel)));
    const todoChars = todo.reduce((s, j) => s + j.text.length, 0);
    console.log(`\n${lessonId}: ${jobs.length} clips, ${todo.length} to generate (${todoChars.toLocaleString('en-IN')} characters)`);
    skipped += jobs.length - todo.length;

    if (flag('dry')) { todo.forEach((j) => console.log(`  ${j.rel.padEnd(18)} ${j.text.slice(0, 70)}${j.text.length > 70 ? '…' : ''}`)); continue; }
    if (!KEY) { console.error('\nNo Sarvam key found. Add SARVAM_API_KEY=... to server/.env'); process.exit(1); }

    for (const j of todo) {
      try {
        const audio = await tts(j.text, j.lang);
        const file = path.join(outDir, j.rel);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, audio);
        manifest[j.rel] = { hash: j.hash, chars: j.text.length, speaker: CONFIG.speaker, bytes: audio.length, at: new Date().toISOString() };
        fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));   // save after every clip: safe to stop and resume
        made++; chars += j.text.length;
        console.log(`  ✓ ${j.rel}  ${(audio.length / 1024).toFixed(0)} KB`);
      } catch (e) {
        failed++; console.error(`  ✗ ${j.rel}  ${e.message}`);
        if (/403/.test(e.message)) process.exit(1);
      }
    }
  }
  console.log(`\nDone. Generated ${made}, unchanged ${skipped}, failed ${failed}. Characters sent: ${chars.toLocaleString('en-IN')}.`);
  if (failed) process.exitCode = 1;
}

main();
