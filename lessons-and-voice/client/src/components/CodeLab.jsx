// ---------------------------------------------------------------
// CodeLab — run-and-see experiments in JavaScript or Python.
// JS runs natively. Python runs in the browser via Pyodide, loaded
// only when a student first picks Python (~10 MB, then cached).
// Student code NEVER runs on our server.
// ---------------------------------------------------------------
import { useEffect, useMemo, useRef, useState } from 'react';

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
let pyodidePromise = null;
function loadPython() {
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = PYODIDE_URL + 'pyodide.js';
      s.onload = () => window.loadPyodide({ indexURL: PYODIDE_URL }).then(resolve, reject);
      s.onerror = () => reject(new Error('Could not load Python. Check your internet connection.'));
      document.head.appendChild(s);
    }).catch((e) => { pyodidePromise = null; throw e; });
  }
  return pyodidePromise;
}

async function runJS(code) {
  const lines = []; const print = (...a) => lines.push(a.join(' '));
  const result = new Function('print', code)(print);
  return { lines, result };
}
async function runPy(code) {
  const py = await loadPython();
  const lines = [];
  py.setStdout({ batched: (s) => lines.push(s) });
  py.runPython('globals().pop("result", None)');
  await py.runPythonAsync(code);
  const r = py.globals.get('result');
  const result = r?.toJs ? r.toJs({ dict_converter: Object.fromEntries }) : r;
  r?.destroy?.();
  return { lines, result };
}

function Experiment({ exp, n, lang, pyMode, createLab, onRun }) {
  const cvRef = useRef(null); const kitRef = useRef(null);
  const [code, setCode] = useState({ js: exp.code, py: exp.py });
  const [out, setOut] = useState('');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const mode = pyMode ? 'py' : 'js';

  const draw = (r, a) => {
    const cv = cvRef.current; if (!cv) return; const ctx = cv.getContext('2d');
    if (!kitRef.current) kitRef.current = createLab(ctx);
    const { labs, paper, txt } = kitRef.current; const s = cv.width / 800; ctx.setTransform(s, 0, 0, s, 0, 0); paper();
    if (!r) { txt(lang === 'ta' ? 'Run அழுத்துங்க' : 'Press Run', 400, 250, { size: 40, weight: 800, align: 'center', color: '#C3CFE2' }); return; }
    try { labs.find((l) => l.id === exp.id).viz(r, a); } catch { txt('The chart needs the original result values.', 40, 250, { size: 22, color: '#C8553D' }); }
  };
  useEffect(() => {
    const cv = cvRef.current; const resize = () => { const d = window.devicePixelRatio || 1; cv.width = Math.round(cv.clientWidth * d); cv.height = Math.round(cv.clientWidth * 10 / 16 * d); draw(res, 1); };
    const ro = new ResizeObserver(resize); ro.observe(cv); return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res, lang]);

  const run = async () => {
    setBusy(true); setOut(pyMode ? 'Running Python… (first run downloads Python, about 10 MB)' : 'Running…');
    const t = performance.now();
    try {
      const { lines, result } = await (pyMode ? runPy(code.py) : runJS(code.js));
      const ms = (performance.now() - t).toFixed(0);
      if (!result || typeof result !== 'object') { setOut(lines.join('\n') + `\n(Keep the ${pyMode ? 'result = …' : 'return'} line at the bottom so the chart can draw.)`); return; }
      setOut(lines.join('\n') + `\n(ran in ${ms} ms)`); setRes(result); onRun(exp.id);
      const t0 = performance.now(); const anim = () => { const a = Math.min(1, (performance.now() - t0) / 900); draw(result, a); if (a < 1) requestAnimationFrame(anim); }; anim();
    } catch (e) {
      const msg = String(e.message || e).trim().split('\n').slice(-3).join('\n');
      setOut('Error: ' + msg + '\nFix the line and press Run again. "Reset code" brings back the original.');
    } finally { setBusy(false); }
  };

  return (
    <section className="lab-exp">
      <div className="lab-head"><span className="lab-num">{n}</span><h3 lang={lang}>{exp.title[lang]}</h3></div>
      <p className="lab-why" lang={lang}>{exp.why[lang]}</p>
      <div className="lab-grid">
        <div>
          <textarea spellCheck={false} value={code[mode]} aria-label={`Code for experiment ${n}`}
            onChange={(ev) => setCode({ ...code, [mode]: ev.target.value })}
            onKeyDown={(ev) => { if (ev.key === 'Tab') { ev.preventDefault(); const el = ev.target; const p = el.selectionStart; el.setRangeText(pyMode ? '    ' : '  ', p, el.selectionEnd, 'end'); setCode({ ...code, [mode]: el.value }); } }} />
          <div className="lab-btns">
            <button onClick={run} disabled={busy}>{busy ? 'Running…' : `Run ${pyMode ? 'Python' : 'JavaScript'}`}</button>
            <button className="lp-ghost" onClick={() => { setCode({ ...code, [mode]: mode === 'py' ? exp.py : exp.code }); setOut(''); setRes(null); }}>Reset code</button>
          </div>
        </div>
        <div><canvas ref={cvRef} /><pre className="lab-out" aria-live="polite">{out || 'Press Run to see output.'}</pre></div>
      </div>
      <div className="lab-ch">
        <b>Challenge</b> <span lang={lang}>{exp.ch[lang]}</span>
        <details><summary>{lang === 'ta' ? 'Answer பார்க்க' : 'Show answer'}</summary><p lang={lang}>{exp.ans[lang]}</p></details>
      </div>
    </section>
  );
}

export default function CodeLab({ createLab, lang, onRun = () => {} }) {
  const exps = useMemo(() => createLab(null).labs, [createLab]);
  const [pyMode, setPyMode] = useState(false);
  return (
    <div className="lab">
      <div className="lab-bar">
        <p lang={lang}>{lang === 'ta' ? 'Run அழுத்துங்க. அப்புறம் CAPITALS-ல இருக்கிற number-ஐ மாத்தி மறுபடியும் run பண்ணுங்க.' : 'Press Run. Then change the number in CAPITALS and run again.'}</p>
        <div className="seg" role="group" aria-label="Programming language">
          <button aria-pressed={!pyMode} onClick={() => setPyMode(false)}>JavaScript</button>
          <button aria-pressed={pyMode} onClick={() => setPyMode(true)}>Python</button>
        </div>
      </div>
      {exps.map((x, i) => <Experiment key={x.id} exp={x} n={i + 1} lang={lang} pyMode={pyMode} createLab={createLab} onRun={onRun} />)}
    </div>
  );
}
