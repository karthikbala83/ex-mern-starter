// ---------------------------------------------------------------
// auditionVoices.js — hear candidate Sarvam voices before choosing.
//   npm run voice:audition
//   npm run voice:audition -- --speakers mani,kavitha,vijay
// Writes server/voice-audition/*.mp3 and index.html. Open index.html
// in your browser, listen, then set VOICE_SPEAKER in server/.env.
// ---------------------------------------------------------------
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const KEY = process.env.SARVAM_API_KEY || process.env.SARVAM_KEY || process.env.SARVAM_API_SUBSCRIPTION_KEY;
const BASE = process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai';
const OUT = path.join(__dirname, '..', 'voice-audition');
const args = process.argv.slice(2);
const i = args.indexOf('--speakers');
const SPEAKERS = (i >= 0 ? args[i + 1] : 'kavitha,mani,gokul,vijay,priya,shubh').split(',').map((s) => s.trim().toLowerCase());
const PACE = Number(process.env.VOICE_PACE || 0.92);

const LINES = {
  ta: 'ஆனா கொஞ்சம் படிச்சிருந்தா, ரெண்டு தப்பான options-ஐ cut பண்ணிடலாம். இப்போ chance ரெண்டுல ஒண்ணு, 50 percent. கவனிச்சீங்களா? படிக்கிறது உங்க probability-ஐயே மாத்துது.',
  en: 'But if you studied a little, you can cut two wrong options. Now your chance is one out of two, 50 percent. Did you notice? Studying literally changes your probability.',
};

async function main() {
  if (!KEY) { console.error('No Sarvam key found. Add SARVAM_API_KEY=... to server/.env'); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const rows = [];
  for (const sp of SPEAKERS) for (const [lang, text] of Object.entries(LINES)) {
    const res = await fetch(`${BASE}/text-to-speech`, {
      method: 'POST', headers: { 'api-subscription-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language_code: lang === 'ta' ? 'ta-IN' : 'en-IN', model: 'bulbul:v3', speaker: sp, pace: PACE, temperature: 0.5, output_audio_codec: 'mp3' }),
    });
    if (!res.ok) { console.error(`✗ ${sp} ${lang}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`); continue; }
    const json = await res.json();
    const file = `${sp}-${lang}.mp3`;
    fs.writeFileSync(path.join(OUT, file), Buffer.from(json.audios.join(''), 'base64'));
    rows.push([sp, lang, file]); console.log(`✓ ${file}`);
  }
  const html = `<!doctype html><meta charset="utf-8"><title>Voice audition</title>
<style>body{font-family:system-ui;max-width:760px;margin:30px auto;padding:0 16px}td{padding:8px}</style>
<h1>Pick the lesson voice</h1><p>Same lines, different speakers. Choose one voice for all lessons, then set <code>VOICE_SPEAKER</code> in server/.env.</p>
<table>${SPEAKERS.map((sp) => `<tr><td><b>${sp}</b></td>${['ta', 'en'].map((l) => rows.find((r) => r[0] === sp && r[1] === l) ? `<td>${l === 'ta' ? 'Tamil' : 'English'}<br><audio controls src="${sp}-${l}.mp3"></audio></td>` : '<td>failed</td>').join('')}</tr>`).join('')}</table>`;
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log(`\nOpen ${path.join(OUT, 'index.html')} in your browser.`);
}
main();
