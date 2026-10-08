// Practice: numeric problems with hint → check → solution → run-the-code.
import { useState } from 'react';
import { Dots, useSwipe, useArrowKeys } from './Pager.jsx';

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
        {/* inputMode="text", not "decimal": the iPhone decimal keypad has no
            minus key, and some answers are negative (−2, −120). */}
        <input inputMode="text" autoComplete="off" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} aria-label="Answer" />
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

// ---------------------------------------------------------------
// One problem per screen.
// A list of nine problems reads like a homework sheet; one at a time
// reads like a conversation. Dots show where you are and which ones are
// solved; arrows, the buttons or a swipe move between them.
//
// Every problem stays MOUNTED and only the current one is shown, so an
// answer typed into problem 3 is still there when the student comes back
// from problem 5. Unmounting would quietly wipe it.
//
// `solved` belongs to the lesson (it is saved as progress), so it comes
// in as a prop instead of living in local state.
// ---------------------------------------------------------------
export default function Practice({ problems, lang, solved = [], onSolve = () => {} }) {
  const [i, setI] = useState(0);
  const go = (n) => setI(Math.max(0, Math.min(problems.length - 1, n)));
  const swipe = useSwipe(() => go(i + 1), () => go(i - 1));
  useArrowKeys(() => go(i - 1), () => go(i + 1));
  const done = new Set(solved);
  const ta = lang === 'ta';

  return (
    <div className="pager" {...swipe}>
      <Dots count={problems.length} at={i} done={done} onPick={go} label="Problem" />
      {problems.map((pr, k) => (
        <div key={k} hidden={k !== i}>
          <Problem pr={pr} n={k} lang={lang} solved={done.has(k)} onSolve={onSolve} />
        </div>
      ))}
      <div className="pager-nav">
        <button className="lp-ghost" onClick={() => go(i - 1)} disabled={i === 0}>← {ta ? 'முந்தையது' : 'Previous'}</button>
        <span className="muted"><b>{ta ? 'தீர்த்தது' : 'Solved'}: {done.size} / {problems.length}</b></span>
        <button className="lp-ghost" onClick={() => go(i + 1)} disabled={i === problems.length - 1}>{ta ? 'அடுத்தது' : 'Next'} →</button>
      </div>
    </div>
  );
}
