// ---------------------------------------------------------------
// LessonPlayer — animated story with pre-generated voice-over.
// One MP3 per beat: /audio/<lesson>/<version>/<lang>/<beatId>.mp3
// When a clip exists, the animation follows the audio clock, so
// voice and visuals stay in sync. No clip? Timer only.
//
// Two layers, kept apart on purpose:
//   ENGINE  (the big useEffect) — beats, audio clock, predict pause,
//           paper() before every frame. Mutable refs, 60 updates/sec.
//   CHROME  (everything else) — a video-style control bar drawn ON the
//           stage: icons, scene progress, captions, fullscreen. React
//           state, updated only when something visible changes.
// The chrome can be redesigned without touching the engine, and that is
// exactly what Session 5 did.
// ---------------------------------------------------------------
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MdPlayArrow, MdPause, MdSkipPrevious, MdSkipNext, MdVolumeUp, MdVolumeOff,
  MdTranslate, MdClosedCaption, MdClosedCaptionDisabled, MdFullscreen, MdFullscreenExit,
  MdScreenRotation, MdCheckCircle, MdReplay,
} from 'react-icons/md';

const W = 1280, H = 720;
const clamp = (x) => Math.max(0, Math.min(1, x));
const estimate = (text, lang) => Math.max(lang === 'ta' ? 3400 : 3000, text.length * (lang === 'ta' ? 68 : 62));
const t = (v, lang) => (typeof v === 'string' ? v : v?.[lang] ?? v?.en ?? '');

// "Phone" = a touch screen that is small in BOTH directions. Width alone
// would call a narrow desktop window a phone; pointer alone would call a
// touch laptop a phone. Only a phone gets fullscreen on the first Play.
const isPhone = () => window.matchMedia?.('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 600;

// Keys belong to whatever has focus first. A text field needs every key;
// a focused button already clicks on Space/Enter, so handling Space here
// as well would toggle play twice.
const ownsKeys = (el, key) =>
  el?.closest?.('input, textarea, select, [contenteditable="true"]') ||
  ((key === ' ' || key === 'Enter') && el?.closest?.('button, a'));

export default function LessonPlayer({ lessonId, version, story, createScenes, lang, onLangChange, onComplete, onNext, nextLabel, resumeScene = 0, onScene }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const fillRefs = useRef([]);            // one progress-segment fill per scene, written by the engine
  const eng = useRef(null);               // mutable engine state (not React state: changes 60x/sec)
  const [ui, setUi] = useState({ started: false, playing: false, scene: 0, beat: 0, asking: false, finished: false });
  const [voiceOn, setVoiceOn] = useState(true);
  const [captions, setCaptions] = useState(false);   // off by default: the voice carries the lesson
  const [missing, setMissing] = useState(false);     // brief "no audio for this beat" badge
  const [fs, setFs] = useState('none');              // 'none' | 'native' | 'immersive'
  const [portrait, setPortrait] = useState(false);
  const [rotateDismissed, setRotateDismissed] = useState(false);
  const [awake, setAwake] = useState(true);          // controls visible?
  const [tip, setTip] = useState(null);              // scene index whose title tooltip is showing
  const langRef = useRef(lang); const voiceRef = useRef(voiceOn);
  const completeRef = useRef(onComplete);
  const sceneRef = useRef(onScene);
  langRef.current = lang; voiceRef.current = voiceOn; completeRef.current = onComplete; sceneRef.current = onScene;

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
    let missingTimer = 0;

    const sync = () => setUi({ started: e.started, playing: e.playing, scene: e.scene, beat: e.beat, asking: e.asking, finished: e.finished });
    const stopAudio = () => { if (e.audio) { e.audio.onended = e.audio.onerror = null; e.audio.pause(); } e.audio = null; e.audioOk = false; };
    const clip = (id, l) => {
      const k = l + id; if (!e.cache.has(k)) { const a = new Audio(url(id, l)); a.preload = 'auto'; e.cache.set(k, a); }
      return e.cache.get(k);
    };
    const nextBeat = () => { const sc = scenes[e.scene]; if (e.beat < sc.beats.length - 1) return beat(e.scene, e.beat + 1); return scenes[e.scene + 1]?.beats[0]; };
    // A clip that has not been generated yet is normal while a lesson is
    // being voiced. A small icon for two seconds says so without a
    // paragraph of text pushing the lesson around.
    const flagMissing = () => { setMissing(true); clearTimeout(missingTimer); missingTimer = setTimeout(() => setMissing(false), 2000); };

    const startBeat = () => {
      stopAudio();
      const b = beat(e.scene, e.beat); const l = langRef.current;
      e.start = performance.now(); e.frozen = 0; e.dur = estimate(b[l], l); e.audioDone = true;
      if (voiceRef.current && e.playing) {
        const a = clip(b.id, l); a.currentTime = 0; e.audio = a; e.audioDone = false;
        a.onended = () => { e.audioDone = true; };
        a.onerror = () => { e.audioDone = true; e.audioOk = false; flagMissing(); };
        a.play().then(() => { e.audioOk = true; }).catch(() => { e.audioDone = true; });
        const n = nextBeat(); if (n) clip(n.id, l);    // warm the next clip
      }
      sync();
    };
    const advance = () => {
      const sc = scenes[e.scene];
      if (sc.ask && sc.ask.afterBeat === e.beat + 1 && !e.answered[e.scene]) { e.asking = true; stopAudio(); sync(); return; }
      if (e.beat < sc.beats.length - 1) { e.beat++; startBeat(); return; }
      if (e.scene < scenes.length - 1) { e.scene++; e.beat = 0; startBeat(); return; }
      e.finished = true; e.playing = false; stopAudio(); sync(); completeRef.current?.();
    };

    const frame = (now) => {
      const s = cv.width / W; ctx.setTransform(s, 0, 0, s, 0, 0);
      if (!e.started) { kit.titleFrame(); e.raf = requestAnimationFrame(frame); return; }
      let p;
      const a = e.audio;
      if (a && e.audioOk && isFinite(a.duration) && a.duration > 0) p = clamp(a.currentTime / a.duration);   // audio clock
      else p = clamp((e.playing && !e.asking ? now - e.start : e.frozen) / e.dur);                         // timer clock
      kit.paper(); ctx.save(); kit.draws[e.scene](e.beat, p, now); ctx.restore();   // clear, then draw
      // The current progress segment fills smoothly with the beat. Written
      // straight to the DOM: routing 60 updates a second through React
      // state would re-render the whole player 60 times a second.
      const fill = fillRefs.current[e.scene];
      if (fill && !e.finished) fill.style.transform = `scaleX(${(e.beat + p) / scenes[e.scene].beats.length})`;
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
    return () => { cancelAnimationFrame(e.raf); stopAudio(); ro.disconnect(); clearTimeout(missingTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, version]);

  // language or voice switch: replay the current beat in the new setting
  useEffect(() => { eng.current?.api.restartBeat(); if (!voiceOn) eng.current?.api.stop(); }, [lang, voiceOn]);

  const api = () => eng.current.api;

  // ---------- auto-hide ----------
  // Controls get out of the way after 3 s of playing, like any video
  // player. They NEVER hide while paused or while a question is up: a
  // student who is stuck must always be able to see what to press.
  const hideTimer = useRef(0);
  const poke = useCallback(() => {
    setAwake(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setAwake(false), 3000);
  }, []);
  useEffect(() => { poke(); }, [ui.playing, poke]);
  useEffect(() => () => clearTimeout(hideTimer.current), []);
  const canHide = ui.playing && !ui.asking && !ui.finished;
  const showControls = awake || !canHide;

  // ---------- fullscreen ----------
  // Real fullscreen where the browser allows it (Android, desktop). iPhone
  // Safari cannot fullscreen a <div> at all, so there we fake it with a
  // fixed black layer over the page: "immersive mode".
  const enterFull = () => {
    const el = wrapRef.current;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req) { setRotateDismissed(false); setFs('immersive'); return; }
    // Called synchronously inside the click handler: browsers only allow
    // fullscreen in direct response to a tap, and an await before this
    // line would lose that "user gesture".
    Promise.resolve(req.call(el))
      .then(async () => {
        // Locking orientation only works once we ARE fullscreen, and only
        // on phones. On a desktop it throws, and that is fine.
        try { await screen.orientation?.lock?.('landscape'); } catch { /* not supported here */ }
      })
      .catch(() => { setRotateDismissed(false); setFs('immersive'); });
  };
  const exitFull = () => {
    if (fs === 'immersive') { setFs('none'); return; }
    try { screen.orientation?.unlock?.(); } catch { /* nothing locked */ }
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (document.fullscreenElement || document.webkitFullscreenElement) Promise.resolve(exit?.call(document)).catch(() => {});
  };
  const toggleFull = () => (fs === 'none' ? enterFull() : exitFull());

  useEffect(() => {
    // The browser, not our button, decides when fullscreen really starts
    // and ends (Esc, the back gesture, a phone call). Listen for it.
    // Leaving fullscreen does NOT pause the lesson: students exit by
    // accident all the time, and a story that stops every time they brush
    // the screen edge is a story they stop watching.
    const onChange = () => {
      const el = document.fullscreenElement || document.webkitFullscreenElement;
      if (el && el === wrapRef.current) setFs('native');
      else setFs((m) => (m === 'native' ? 'none' : m));
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
      // Leaving the Watch step while fullscreen must not strand the
      // student in a black screen with nothing in it.
      if (document.fullscreenElement === wrapRef.current) document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  // Immersive mode is just a fixed layer, so the page behind it would
  // still scroll under a finger. Freeze it while the layer is up.
  useEffect(() => {
    if (fs !== 'immersive') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [fs]);

  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)');
    const on = () => setPortrait(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    window.addEventListener('orientationchange', on);
    return () => { mq.removeEventListener?.('change', on); window.removeEventListener('orientationchange', on); };
  }, []);

  // ---------- keep the screen on while playing ----------
  // A phone dims and locks after ~30 s without a touch, which is mid-scene
  // for a lesson. The Wake Lock API asks it not to. Unsupported browsers
  // (older iOS) just behave as before, hence the try/catch.
  useEffect(() => {
    if (!ui.playing || !('wakeLock' in navigator)) return;
    let lock = null, cancelled = false;
    const get = async () => {
      try { lock = await navigator.wakeLock.request('screen'); if (cancelled) lock.release().catch(() => {}); } catch { /* denied or unsupported */ }
    };
    get();
    // The browser drops the lock whenever the tab is hidden; take it again on return.
    const onVis = () => { if (document.visibilityState === 'visible' && !cancelled) get(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelled = true; document.removeEventListener('visibilitychange', onVis); lock?.release().catch(() => {}); };
  }, [ui.playing]);

  // ---------- actions ----------
  // ---------- resume ----------
  // Report each new scene so the lesson can remember where the student is.
  // Only once playing has started: the title frame is not "scene 1 watched".
  useEffect(() => { if (ui.started && !ui.finished) sceneRef.current?.(ui.scene); }, [ui.scene, ui.started, ui.finished]);
  // A student who left at scene 4 should not have to sit through 1-3 again.
  const resumeAt = resumeScene > 0 && resumeScene < scenes.length ? resumeScene : 0;

  const togglePlay = () => {
    // The first Play on a phone is a real tap — the one moment the browser
    // lets us go fullscreen — so we use it to turn the phone into a screen.
    if (!ui.started && fs === 'none' && isPhone()) enterFull();
    if (!ui.started && resumeAt) api().go(resumeAt);   // continue where they left off
    else api().play();
    poke();
  };
  const goScene = (i) => { api().go(i); poke(); };

  // ---------- keyboard ----------
  // Read through a ref so the listener is attached once but always sees
  // the latest state.
  const keyRef = useRef(null);
  keyRef.current = (ev) => {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.key === 'Escape' && fs === 'immersive') { setFs('none'); return; }
    if (ownsKeys(ev.target, ev.key)) return;
    const k = ev.key.toLowerCase();
    if (ev.key === ' ') { ev.preventDefault(); if (!ui.asking) togglePlay(); }
    else if (ev.key === 'ArrowLeft') goScene(ui.scene - 1);
    else if (ev.key === 'ArrowRight') goScene(ui.scene + 1);
    else if (k === 'f') toggleFull();
    else if (k === 'c') setCaptions((c) => !c);
    else if (k === 'm') setVoiceOn((v) => !v);
    else return;
    poke();
  };
  useEffect(() => {
    const h = (ev) => keyRef.current(ev);
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // A tap on the picture while the controls are hidden only brings them
  // back. Without this, the tap meant to find the pause button would
  // pause or resume the lesson by surprise.
  const onStageClick = (ev) => {
    if (ev.target !== ev.currentTarget && ev.target !== canvasRef.current) return;
    if (!showControls) { poke(); return; }
    if (ui.asking || ui.finished) return;
    togglePlay();
  };

  // ---------- scene tooltip: hover on desktop, long-press on touch ----------
  const press = useRef({ timer: 0, long: false });
  const segDown = (i) => (ev) => {
    if (ev.pointerType === 'mouse') return;
    press.current.long = false;
    clearTimeout(press.current.timer);
    press.current.timer = setTimeout(() => { press.current.long = true; setTip(i); }, 450);
  };
  const segUp = () => {
    clearTimeout(press.current.timer);
    if (press.current.long) setTimeout(() => setTip(null), 1200);
  };
  const segClick = (i) => () => {
    if (press.current.long) { press.current.long = false; return; }   // a long-press peeks, it doesn't jump
    goScene(i);
  };

  const cur = ui.started ? beat(ui.scene, ui.beat) : null;
  const ask = scenes[ui.scene]?.ask;
  const full = fs !== 'none';
  const ta = lang === 'ta';

  return (
    <div ref={wrapRef} className={'lp' + (full ? ' is-full' : '') + (fs === 'immersive' ? ' is-immersive' : '')}
      onPointerMove={(ev) => { if (ev.pointerType === 'mouse') poke(); }}>
      <div className={'lp-stage' + (showControls ? '' : ' lp-idle')} onClick={onStageClick}>
        <canvas ref={canvasRef} aria-label="Animated lesson" />

        {missing && (
          <span className="lp-badge" role="status" title={ta ? 'இந்த பகுதிக்கு voice இன்னும் இல்லை' : 'No voice-over for this part yet'}>
            <MdVolumeOff aria-hidden="true" />
          </span>
        )}

        {(!ui.started || (!ui.playing && !ui.asking && !ui.finished)) && (
          <button className="lp-big" onClick={togglePlay}
            aria-label={ui.started ? 'Play' : resumeAt ? `Resume from scene ${resumeAt + 1}` : 'Start the lesson'}
            title={ui.started ? 'Play' : resumeAt ? `Resume from scene ${resumeAt + 1}` : 'Start the lesson'}>
            <MdPlayArrow aria-hidden="true" />
            {/* A number, not a sentence: "4 / 10" under Play says "you were here". */}
            {!ui.started && resumeAt > 0 && <span className="lp-resume" aria-hidden="true">{resumeAt + 1} / {scenes.length}</span>}
          </button>
        )}

        {ui.asking && ask && (
          <div className="lp-ask" role="dialog" aria-label="Predict">
            <p lang={lang}>{ask.q[lang]}</p>
            <div>{ask.options.map((o) => <button key={o} onClick={() => api().answer(o)}>{o}</button>)}</div>
            <small lang={lang}>{ask.hint[lang]}</small>
          </div>
        )}

        {ui.finished && (
          <div className="lp-end" role="dialog" aria-label="Lesson finished">
            <p className="lp-end-tick"><MdCheckCircle aria-hidden="true" /> {ta ? 'பார்த்து முடிச்சாச்சு' : 'Watched'}</p>
            {onNext && <button className="lp-end-next" onClick={() => { exitFull(); onNext(); }}>Next: {nextLabel} →</button>}
            <button className="lp-end-replay" onClick={() => api().play()}><MdReplay aria-hidden="true" /> {ta ? 'மறுபடியும் பார்க்க' : 'Watch again'}</button>
          </div>
        )}

        {/* Subtitles live INSIDE the picture, like a film, so they come
            along into fullscreen. Off by default, but always one tap away:
            this is the path for a deaf student or a noisy classroom. */}
        {captions && cur && !ui.asking && !ui.finished && (
          <p className={'lp-cc' + (showControls ? ' lifted' : '')} lang={lang} aria-live="polite">{cur[lang]}</p>
        )}

        <div className={'lp-bar' + (showControls ? '' : ' hidden')} onClick={(ev) => ev.stopPropagation()}>
          {/* One segment per scene. This replaced the list of scene names:
              it shows where you are AND how much is left, in one strip. */}
          <div className="lp-segs" role="group" aria-label="Scenes">
            {scenes.map((s, i) => {
              const past = ui.finished || i < ui.scene;
              const style = i === ui.scene && !ui.finished ? undefined : { transform: `scaleX(${past ? 1 : 0})` };
              const title = `${i + 1}. ${t(s.title, lang)}`;
              return (
                <button key={s.id} className={'lp-seg' + (i === ui.scene ? ' on' : '')}
                  aria-label={title} title={title}
                  onClick={segClick(i)} onPointerDown={segDown(i)} onPointerUp={segUp} onPointerCancel={segUp}
                  onPointerEnter={(ev) => ev.pointerType === 'mouse' && setTip(i)}
                  onPointerLeave={(ev) => ev.pointerType === 'mouse' && setTip(null)}
                  onContextMenu={(ev) => ev.preventDefault()}>
                  <span className="lp-seg-track"><span className="lp-seg-fill" ref={(el) => { fillRefs.current[i] = el; }} style={style} /></span>
                  {tip === i && <span className={'lp-tip' + (i === 0 ? ' start' : i === scenes.length - 1 ? ' end' : '')} lang={lang}>{title}</span>}
                </button>
              );
            })}
          </div>

          <div className="lp-row">
            <button onClick={togglePlay} aria-label={ui.playing ? 'Pause (Space)' : 'Play (Space)'} title={ui.playing ? 'Pause (Space)' : 'Play (Space)'}>
              {ui.playing ? <MdPause aria-hidden="true" /> : <MdPlayArrow aria-hidden="true" />}
            </button>
            <button onClick={() => goScene(ui.scene - 1)} aria-label="Previous scene (←)" title="Previous scene (←)">
              <MdSkipPrevious aria-hidden="true" />
            </button>
            <button onClick={() => goScene(ui.scene + 1)} disabled={ui.scene >= scenes.length - 1} aria-label="Next scene (→)" title="Next scene (→)">
              <MdSkipNext aria-hidden="true" />
            </button>
            <span className="lp-count" aria-hidden="true">{ui.scene + 1} / {scenes.length}</span>

            <span className="lp-spacer" />

            <button onClick={() => { setVoiceOn((v) => !v); poke(); }} aria-pressed={voiceOn}
              aria-label={voiceOn ? 'Mute voice (M)' : 'Turn voice on (M)'} title={voiceOn ? 'Mute voice (M)' : 'Turn voice on (M)'}>
              {voiceOn ? <MdVolumeUp aria-hidden="true" /> : <MdVolumeOff aria-hidden="true" />}
            </button>
            <button className="lp-lang" onClick={() => { onLangChange?.(ta ? 'en' : 'ta'); poke(); }}
              aria-label={ta ? 'Switch to English' : 'தமிழுக்கு மாற்று (Switch to Tamil)'} title={ta ? 'Switch to English' : 'Switch to Tamil'}>
              <MdTranslate aria-hidden="true" /><span lang={lang}>{ta ? 'த' : 'EN'}</span>
            </button>
            <button onClick={() => { setCaptions((c) => !c); poke(); }} aria-pressed={captions}
              aria-label={captions ? 'Hide captions (C)' : 'Show captions (C)'} title={captions ? 'Hide captions (C)' : 'Show captions (C)'}>
              {captions ? <MdClosedCaption aria-hidden="true" /> : <MdClosedCaptionDisabled aria-hidden="true" />}
            </button>
            <button onClick={() => { toggleFull(); poke(); }}
              aria-label={full ? 'Exit full screen (F)' : 'Full screen (F)'} title={full ? 'Exit full screen (F)' : 'Full screen (F)'}>
              {full ? <MdFullscreenExit aria-hidden="true" /> : <MdFullscreen aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* iPhone only: Safari cannot rotate the page for us, so we ask. The
          overlay disappears by itself once the phone is turned. "Continue"
          is there for a student whose rotation lock is on. */}
      {fs === 'immersive' && portrait && !rotateDismissed && (
        <div className="lp-rotate" role="dialog" aria-label="Rotate your phone">
          <MdScreenRotation aria-hidden="true" className="lp-rotate-icon" />
          <p lang={lang}>{ta ? 'Phone-ஐ திருப்புங்க' : 'Rotate your phone'}</p>
          <div>
            <button onClick={() => setRotateDismissed(true)}>{ta ? 'இப்படியே பார்க்க' : 'Continue anyway'}</button>
            <button onClick={exitFull} aria-label="Exit full screen" title="Exit full screen"><MdFullscreenExit aria-hidden="true" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
