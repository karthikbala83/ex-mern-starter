// ---------------------------------------------------------------
// LessonPlayer — animated story with pre-generated voice-over.
// One MP3 per beat: /audio/<lesson>/<version>/<lang>/<beatId>.mp3
// When a clip exists, the animation follows the audio clock, so
// voice and visuals stay in sync. No clip? Captions + timer only.
// ---------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';

const W = 1280, H = 720;
const clamp = (x) => Math.max(0, Math.min(1, x));
const estimate = (text, lang) => Math.max(lang === 'ta' ? 3400 : 3000, text.length * (lang === 'ta' ? 68 : 62));

export default function LessonPlayer({ lessonId, version, story, createScenes, lang, onComplete }) {
  const canvasRef = useRef(null);
  const eng = useRef(null);               // mutable engine state (not React state: changes 60x/sec)
  const [ui, setUi] = useState({ started: false, playing: false, scene: 0, beat: 0, asking: false, finished: false });
  const [voiceOn, setVoiceOn] = useState(true);
  const [note, setNote] = useState('');
  const seen = useRef(new Set());
  const langRef = useRef(lang); const voiceRef = useRef(voiceOn);
  langRef.current = lang; voiceRef.current = voiceOn;

  const scenes = story.scenes;
  const beat = (s, b) => scenes[s].beats[b];
  const url = (id, l) => `/audio/${lessonId}/${version}/${l}/${id}.mp3`;

  // ---------- engine ----------
  useEffect(() => {
    const cv = canvasRef.current; const ctx = cv.getContext('2d');
    const kit = createScenes(ctx);
    const e = { started: false, playing: false, scene: 0, beat: 0, start: 0, frozen: 0, dur: 4000,
      audio: null, audioOk: false, audioDone: true, asking: false, answered: {}, finished: false, raf: 0, cache: new Map() };
    eng.current = e;

    const sync = () => setUi({ started: e.started, playing: e.playing, scene: e.scene, beat: e.beat, asking: e.asking, finished: e.finished });
    const stopAudio = () => { if (e.audio) { e.audio.onended = e.audio.onerror = null; e.audio.pause(); } e.audio = null; e.audioOk = false; };
    const clip = (id, l) => {
      const k = l + id; if (!e.cache.has(k)) { const a = new Audio(url(id, l)); a.preload = 'auto'; e.cache.set(k, a); }
      return e.cache.get(k);
    };
    const nextBeat = () => { const sc = scenes[e.scene]; if (e.beat < sc.beats.length - 1) return beat(e.scene, e.beat + 1); return scenes[e.scene + 1]?.beats[0]; };

    const startBeat = () => {
      stopAudio();
      const b = beat(e.scene, e.beat); const l = langRef.current;
      e.start = performance.now(); e.frozen = 0; e.dur = estimate(b[l], l); e.audioDone = true;
      seen.current.add(e.scene);
      if (voiceRef.current && e.playing) {
        const a = clip(b.id, l); a.currentTime = 0; e.audio = a; e.audioDone = false;
        a.onended = () => { e.audioDone = true; };
        a.onerror = () => { e.audioDone = true; e.audioOk = false; setNote(l === 'ta' ? 'Tamil voice-over not generated yet. Showing captions.' : 'English voice-over not generated yet. Showing captions.'); };
        a.play().then(() => { e.audioOk = true; setNote(''); }).catch(() => { e.audioDone = true; });
        const n = nextBeat(); if (n) clip(n.id, l);    // warm the next clip
      }
      sync();
    };
    const advance = () => {
      const sc = scenes[e.scene];
      if (sc.ask && sc.ask.afterBeat === e.beat + 1 && !e.answered[e.scene]) { e.asking = true; stopAudio(); sync(); return; }
      if (e.beat < sc.beats.length - 1) { e.beat++; startBeat(); return; }
      if (e.scene < scenes.length - 1) { e.scene++; e.beat = 0; startBeat(); return; }
      e.finished = true; e.playing = false; stopAudio(); sync(); onComplete?.();
    };

    const frame = (now) => {
      const s = cv.width / W; ctx.setTransform(s, 0, 0, s, 0, 0);
      if (!e.started) { kit.titleFrame(); e.raf = requestAnimationFrame(frame); return; }
      let p;
      const a = e.audio;
      if (a && e.audioOk && isFinite(a.duration) && a.duration > 0) p = clamp(a.currentTime / a.duration);   // audio clock
      else p = clamp((e.playing && !e.asking ? now - e.start : e.frozen) / e.dur);                         // timer clock
      kit.paper(); ctx.save(); kit.draws[e.scene](e.beat, p, now); ctx.restore();   // clear, then draw
      const timerDone = now - e.start >= e.dur;
      if (e.playing && !e.asking && e.audioDone && (e.audioOk || timerDone)) advance();
      e.raf = requestAnimationFrame(frame);
    };

    e.api = {
      play() {
        if (!e.started) { e.started = true; e.playing = true; startBeat(); return; }
        if (e.finished) { e.finished = false; e.playing = true; e.scene = 0; e.beat = 0; e.answered = {}; startBeat(); return; }
        e.playing = !e.playing;
        if (e.playing) { e.start = performance.now() - e.frozen; if (e.audio && !e.audioDone) e.audio.play().catch(() => {}); }
        else { e.frozen = performance.now() - e.start; e.audio?.pause(); }
        sync();
      },
      go(i) { e.started = true; e.playing = true; e.finished = false; e.asking = false; e.scene = Math.max(0, Math.min(scenes.length - 1, i)); e.beat = 0; startBeat(); },
      answer(opt) { e.answered[e.scene] = opt; e.asking = false; e.beat++; startBeat(); },
      restartBeat() { if (e.started && !e.asking && e.playing) startBeat(); },
      stop: stopAudio,
    };

    const resize = () => { const d = window.devicePixelRatio || 1; cv.width = Math.round(cv.clientWidth * d); cv.height = Math.round(cv.clientWidth * 9 / 16 * d); };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();
    (document.fonts?.ready || Promise.resolve()).then(() => { e.raf = requestAnimationFrame(frame); });
    return () => { cancelAnimationFrame(e.raf); stopAudio(); ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, version]);

  // language or voice switch: replay the current beat in the new setting
  useEffect(() => { eng.current?.api.restartBeat(); if (!voiceOn) { eng.current?.api.stop(); setNote(''); } }, [lang, voiceOn]);

  const api = () => eng.current.api;
  const cur = ui.started ? beat(ui.scene, ui.beat) : null;
  const ask = scenes[ui.scene]?.ask;

  return (
    <div className="lp">
      <div className="lp-stage">
        <canvas ref={canvasRef} aria-label="Animated lesson" />
        {!ui.started && <button className="lp-big" onClick={() => api().play()}>▶ Start the lesson</button>}
        {ui.asking && ask && (
          <div className="lp-ask" role="dialog" aria-label="Predict">
            <p lang={lang}>{ask.q[lang]}</p>
            <div>{ask.options.map((o) => <button key={o} onClick={() => api().answer(o)}>{o}</button>)}</div>
            <small lang={lang}>{ask.hint[lang]}</small>
          </div>
        )}
        {ui.finished && <div className="lp-done"><a href="#lab">{lang === 'ta' ? 'Lesson முடிஞ்சது. இப்போ code lab try பண்ணுங்க ↓' : 'Lesson complete. Now try the code lab ↓'}</a></div>}
      </div>

      <div className="lp-controls">
        <button onClick={() => api().play()}>{ui.playing ? 'Pause' : ui.finished ? 'Replay' : 'Play'}</button>
        <button className="lp-ghost" onClick={() => api().go(ui.scene - 1)}>◀ Previous</button>
        <button className="lp-ghost" onClick={() => api().go(ui.scene + 1)}>Next ▶</button>
        <label className="lp-voice"><input type="checkbox" checked={voiceOn} onChange={(ev) => setVoiceOn(ev.target.checked)} /> Voice</label>
      </div>
      <p className="lp-caption" lang={lang} aria-live="polite">
        {cur ? cur[lang] : lang === 'ta' ? 'Start அழுத்துங்க. Voice-ஓட சேர்ந்து animation ஓடும்.' : 'Press Start. The animation plays along with the voice.'}
      </p>
      {note && <p className="muted">{note}</p>}
      <ol className="lp-scenes">
        {scenes.map((s, i) => (
          <li key={s.id}><button className={(i === ui.scene && ui.started ? 'on ' : '') + (seen.current.has(i) ? 'seen' : '')} onClick={() => api().go(i)}>{i + 1}. {s.title}</button></li>
        ))}
      </ol>
    </div>
  );
}
