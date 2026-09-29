import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// lottie-react v3 has no default export, and LottieLight is the smaller
// renderer — same choice as Game.jsx. See the note there.
import { LottieLight as Lottie } from 'lottie-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext.jsx';
import { missions as defs } from '../missions/defs/index.js';
import { worlds } from '../missions/catalog.js';
import useRunner, { TIMEOUT_MESSAGE } from '../missions/useRunner.js';
import trophy from '../assets/trophy.json';

// Bilingual helper, the same contract as Enovix: fall back to English when
// a Tamil string has not been written yet.
const t = (v, lang) => (typeof v === 'string' ? v : v?.[lang] ?? v?.en ?? '');

const STAGE_LABEL = {
  fill: { en: 'Fill the gap', ta: 'இடைவெளியை நிரப்பு' },
  write: { en: 'Write it', ta: 'நீங்களே எழுதுங்க' },
  bonus: { en: '⭐ Bonus', ta: '⭐ Bonus' },
};

// Find which lesson a mission belongs to, so the header can link to it —
// or say "coming soon" when the lesson itself is not built yet.
function findLesson(missionId) {
  for (const w of worlds) {
    for (const l of w.lessons) {
      if (l.missions.some((m) => m.id === missionId)) return { world: w, lesson: l };
    }
  }
  return {};
}

export default function MissionPlayer() {
  const { id } = useParams();
  const def = defs[id];
  const { toast } = useToast();
  const run = useRunner();

  const [lang, setLang] = useState('ta');
  const [stage, setStage] = useState('fill');
  // One draft per stage. Sharing a single buffer would wipe a student's
  // "write" attempt the moment they peeked at the "fill" tab.
  const [code, setCode] = useState({});
  const [progress, setProgress] = useState(null);
  const [samples, setSamples] = useState(null);
  const [logs, setLogs] = useState([]);
  const [runError, setRunError] = useState('');
  const [result, setResult] = useState(null);
  const [hints, setHints] = useState([]);
  const [busy, setBusy] = useState(false);
  const [predictPick, setPredictPick] = useState(null);
  const [predictResult, setPredictResult] = useState(null);

  // The function used to draw the preview. Only ever set from code that
  // passed every visible sample test — a half-written function would throw
  // 60 times a second inside requestAnimationFrame.
  const previewFn = useRef(null);
  const canvasRef = useRef(null);

  const { world, lesson } = useMemo(() => findLesson(id), [id]);

  useEffect(() => {
    if (!def) return;
    setCode({ fill: def.fill, write: def.write, bonus: def.bonus?.starter ?? '' });
  }, [def]);

  const loadProgress = useCallback(async () => {
    try {
      const { data } = await api.get('/missions/progress');
      setProgress(data.missions?.[id] ?? null);
    } catch { /* not fatal: the mission is still playable */ }
  }, [id]);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  // ---- The preview canvas ----
  // def.preview draws one frame; we call it on every animation frame with a
  // growing clock. This is the payoff: the rain sways, the character walks.
  useEffect(() => {
    if (!def) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    let raf;
    const start = performance.now();

    const frame = (now) => {
      try {
        def.preview(ctx, previewFn.current, now - start, W, H);
      } catch {
        // Student code can still throw on inputs the sample tests did not
        // cover. Drop the function rather than let the canvas die.
        previewFn.current = null;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);   // stop drawing when we unmount
  }, [def]);

  if (!def) {
    return (
      <div className="card">
        <h2>Mission not found</h2>
        <p className="muted">This mission is not open yet.</p>
        <Link className="fb-open" to="/missions">Back to missions</Link>
      </div>
    );
  }

  const stages = def.bonus ? ['fill', 'write', 'bonus'] : ['fill', 'write'];
  const libs = stage === 'bonus' && def.bonus ? [def.bonus.pkg] : [];
  const done = progress?.stages ?? {};

  // ---- Predict ----
  const sendPredict = async (choice) => {
    setPredictPick(choice);
    try {
      const { data } = await api.post(`/missions/${id}/predict`, { choice });
      setPredictResult(data);
      if (data.correct && data.points) toast(`Correct! +${data.points} points`, 'success');
      loadProgress();
    } catch { toast('Could not save your answer', 'warn'); }
  };

  // ---- Run the visible sample tests (no server, no points) ----
  const runSamples = async () => {
    setBusy(true); setRunError(''); setResult(null);
    const res = await run(code[stage] || '', def.fnName, [], libs, def.sampleTests);
    setBusy(false);
    setLogs(res.logs || []);
    if (!res.ok) { setRunError(res.error); setSamples(null); previewFn.current = null; return; }
    setSamples(res.sampleResults);

    // Compile for the preview only if EVERY sample passed.
    if (res.sampleResults.every((r) => r.pass)) {
      try {
        // eslint-disable-next-line no-new-func
        const factory = new Function(`${code[stage]}\n;return ${def.fnName};`);
        previewFn.current = factory();
        toast('All sample tests passed — look at the preview!', 'success');
      } catch { previewFn.current = null; }
    } else {
      previewFn.current = null;
    }
  };

  // ---- Submit for points: start → worker on hidden inputs → submit ----
  const submit = async () => {
    setBusy(true); setRunError(''); setResult(null);
    try {
      const { data: started } = await api.post(`/missions/${id}/start`, { stage });
      const res = await run(code[stage] || '', def.fnName, started.inputs, libs, def.sampleTests);
      if (!res.ok) { setRunError(res.error); setBusy(false); return; }
      setLogs(res.logs || []);

      const { data } = await api.post(`/missions/${id}/submit`, {
        attemptId: started.attemptId, outputs: res.outputs, code: code[stage] || '',
      });
      setResult(data);
      if (data.passed) {
        toast(data.pointsEarned ? `Passed! +${data.pointsEarned} points` : 'Passed (already earned)', 'success');
        loadProgress();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not submit';
      if (err.response?.status === 429) toast(msg, 'warn'); else setRunError(msg);
    } finally { setBusy(false); }
  };

  const getHint = async () => {
    try {
      const { data } = await api.post(`/missions/${id}/hint`);
      setHints((h) => [...h, data]);
      loadProgress();
    } catch (err) { toast(err.response?.data?.message || 'No hints left', 'warn'); }
  };

  // The trophy plays once, for finishing "write" — the milestone stage.
  const showTrophy = result?.passed && stage === 'write' && result.pointsEarned > 0;

  return (
    <div className="mission">
      {/* 1. Header */}
      <div className="lesson-top">
        <div>
          <p className="muted">
            {def.product === 'game' ? '🎮 Campus Quest' : '🏢 CampusOps'} · World {def.world}
            {world ? ` · ${t(world.title, lang)}` : ''}
          </p>
          <h2 lang={lang}>{t(def.title, lang)}</h2>
          {lesson && (lesson.status === 'live'
            ? <Link to={lesson.route || `/enovix/${lesson.id}`}>Open the lesson →</Link>
            : <span className="badge">Lesson coming soon</span>)}
        </div>
        <div className="lang-switch">
          <button aria-pressed={lang === 'ta'} onClick={() => setLang('ta')} lang="ta">தமிழ்</button>
          <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
        </div>
      </div>

      {/* 2. Story */}
      <div className="card"><p lang={lang}>{t(def.story, lang)}</p></div>

      {/* 3. Preview — the instant payoff */}
      <div className="card">
        <h3>Live preview</h3>
        <canvas ref={canvasRef} width={640} height={400} className="mission-canvas" />
        <p className="muted">Pass the sample tests and this comes alive.</p>
      </div>

      {/* 4. Predict */}
      <div className="card">
        <h3>1. Predict {done.predict && <span className="badge">✓ done</span>}</h3>
        <p lang={lang}>{t(def.predict.q, lang)}</p>
        <div className="predict-row">
          {def.predict.options.map((o, i) => (
            <button key={o} onClick={() => sendPredict(i)}
              className={predictPick === i ? 'predict-picked' : ''} disabled={done.predict}>{o}</button>
          ))}
        </div>
        {predictResult && (
          <p className={predictResult.correct ? 'info' : 'error'}>
            {predictResult.correct ? 'Correct!' : 'Not quite — try the code and see.'}
          </p>
        )}
      </div>

      {/* 5-7. Code */}
      <div className="card">
        <h3>2. Code</h3>
        <div className="seg stage-tabs">
          {stages.map((s) => (
            <button key={s} aria-pressed={stage === s} onClick={() => { setStage(s); setSamples(null); setResult(null); setRunError(''); }}>
              {t(STAGE_LABEL[s], lang)} {done[s] && '✓'}
            </button>
          ))}
        </div>

        {stage === 'bonus' && def.bonus && (
          <p className="muted" lang={lang}>{t(def.bonus.note, lang)}</p>
        )}
        <p className="muted"><code>{def.signature}</code></p>

        <textarea
          className="code-area" rows="12" spellCheck="false" value={code[stage] ?? ''}
          onChange={(e) => setCode({ ...code, [stage]: e.target.value })}
          // Tab inserts two spaces instead of leaving the box — same as CodeLab.
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              const el = e.target; const p = el.selectionStart;
              el.setRangeText('  ', p, el.selectionEnd, 'end');
              setCode({ ...code, [stage]: el.value });
            }
          }} />

        <div className="ref-row">
          <button onClick={runSamples} disabled={busy}>Run sample tests</button>
          <button onClick={submit} disabled={busy} className="submit-btn">
            {busy ? 'Running…' : 'Submit for points'}
          </button>
          <button onClick={getHint} disabled={busy} className="hint-btn">
            Get hint (−5){progress ? ` · ${progress.hintsUsed}/3 used` : ''}
          </button>
        </div>

        {runError && <p className="error">{runError === TIMEOUT_MESSAGE ? `⏱ ${runError}` : runError}</p>}

        {samples && (
          <table>
            <thead><tr><th></th><th>Input</th><th>Expected</th><th>Got</th></tr></thead>
            <tbody>
              {samples.map((s, i) => (
                <tr key={i} className={s.pass ? 'sample-ok' : 'sample-bad'}>
                  <td>{s.pass ? '✓' : '✗'}</td>
                  <td><code>{JSON.stringify(s.args)}</code></td>
                  <td><code>{JSON.stringify(s.expect)}</code></td>
                  <td><code>{JSON.stringify(s.got)}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {logs.length > 0 && <pre className="lab-out">{logs.join('\n')}</pre>}

        {hints.map((h) => (
          <p key={h.level} className="hint-line" lang={lang}>💡 {t(h.hint, lang)}</p>
        ))}
      </div>

      {/* 8. Result */}
      {result && (
        <div className={`card ${result.passed ? 'result-pass' : 'result-fail'}`}>
          {showTrophy && <Lottie src={trophy} autoplay loop={false} style={{ width: 110, height: 110 }} />}
          {result.passed ? (
            <>
              <h3>Passed every hidden test 🎉</h3>
              <p>+{result.pointsEarned} points · total {result.totalPoints} · rank #{result.rank}</p>
            </>
          ) : (
            <>
              <h3>{result.message}</h3>
              <p className="muted">{result.failed} of {result.of} hidden cases failed. Here is one:</p>
              {result.example && (
                <pre className="lab-out">{`input    ${JSON.stringify(result.example.input)}
expected ${JSON.stringify(result.example.expected)}
you got  ${JSON.stringify(result.example.got)}`}</pre>
              )}
            </>
          )}
        </div>
      )}

      <Link to="/missions" className="fb-open">← All missions</Link>
    </div>
  );
}
