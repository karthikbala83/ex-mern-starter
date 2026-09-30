// Practice: numeric problems with hint → check → solution → run-the-code.
import { useState } from 'react';

function Problem({ pr, n, lang, solved, onSolve }) {
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [out, setOut] = useState('');
  const check = () => {
    const v = parseFloat(String(val).replace(/[^0-9.\-]/g, ''));
    if (Number.isNaN(v)) return setFb({ ok: false, msg: lang === 'ta' ? 'ஒரு number type பண்ணுங்க.' : 'Type a number.' });
    if (Math.abs(v - pr.ans) <= pr.tol) { setFb({ ok: true, msg: lang === 'ta' ? '✓ சரி!' : '✓ Correct!' }); onSolve(n); }
    else setFb({ ok: false, msg: (lang === 'ta' ? '✗ இன்னும் ஒரு முறை. ' : '✗ Not yet. ') + pr.hint[lang] });
  };
  const run = () => { try { setOut('→ ' + new Function('return (' + pr.code + ')')()); } catch (e) { setOut(e.message); } };
  return (
    <div className={'card prob' + (solved ? ' ok' : '')}>
      <span className="prob-tag">{pr.type[lang]}</span>
      <p lang={lang}><b>{n + 1}. {pr.q[lang]}</b></p>
      <div className="prob-in">
        <input inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} aria-label="Answer" />
        <span>{pr.unit}</span>
        <button onClick={check}>Check</button>
        <button className="lp-ghost" onClick={() => setFb({ ok: null, msg: '💡 ' + pr.hint[lang] })}>Hint</button>
      </div>
      {fb && <p className={'prob-fb ' + (fb.ok === true ? 'good' : fb.ok === false ? 'bad' : '')} lang={lang}>{fb.msg}</p>}
      <details>
        <summary>{lang === 'ta' ? 'Solution பார்க்க' : 'Show solution'}</summary>
        <p lang={lang}>{pr.sol[lang]}</p>
        <code className="prob-code">{pr.code}</code>
        <button className="lp-ghost" onClick={run}>Run this code</button> <span>{out}</span>
      </details>
    </div>
  );
}

export default function Practice({ problems, lang }) {
  const [solved, setSolved] = useState(new Set());
  return (
    <div>
      <p className="muted"><b>{lang === 'ta' ? 'தீர்த்தது' : 'Solved'}: {solved.size} / {problems.length}</b></p>
      {problems.map((pr, i) => (
        <Problem key={i} pr={pr} n={i} lang={lang} solved={solved.has(i)} onSolve={(k) => setSolved(new Set([...solved, k]))} />
      ))}
    </div>
  );
}
