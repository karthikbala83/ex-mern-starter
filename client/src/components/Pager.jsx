// ---------------------------------------------------------------
// Small pieces shared by every "one item per screen" step
// (Practice, Code lab, Quiz): position dots, swipe, arrow keys.
// Written once here so the three steps feel the same to a student.
// ---------------------------------------------------------------
import { useEffect, useRef } from 'react';
import { MdCheck, MdClose } from 'react-icons/md';

// "3 / 8" plus one dot per item. A ✓ marks the ones already done, so a
// student can see at a glance which problem they skipped. `wrong` is for
// the quiz, where an answered question can also be a missed one.
// Class is pg-dot, NOT dot: .dot is the reaction game's target (Game.jsx),
// and global CSS class names collide across the whole app.
export function Dots({ count, at, done = new Set(), wrong = new Set(), onPick, label = 'Item' }) {
  return (
    <div className="dots">
      <span className="dots-count">{at + 1} / {count}</span>
      <div className="dots-row" role="group" aria-label={`${label}s`}>
        {Array.from({ length: count }, (_, i) => (
          <button key={i} className={'pg-dot' + (i === at ? ' on' : '') + (done.has(i) ? ' done' : '') + (wrong.has(i) ? ' wrong' : '')}
            onClick={() => onPick(i)} aria-current={i === at ? 'step' : undefined}
            aria-label={`${label} ${i + 1}${done.has(i) ? ' (done)' : wrong.has(i) ? ' (missed)' : ''}`} title={`${label} ${i + 1}`}>
            {done.has(i) ? <MdCheck aria-hidden="true" /> : wrong.has(i) ? <MdClose aria-hidden="true" /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

// Horizontal swipe = next / previous. Returns props to spread on a wrapper.
// Only a clearly sideways move counts (|dx| > 60 and wider than it is
// tall) so scrolling down a long problem never flips the page.
export function useSwipe(onLeft, onRight) {
  const start = useRef(null);
  return {
    onTouchStart: (e) => {
      // A swipe that starts in a text box or code editor is the student
      // selecting text, not asking for the next item.
      if (e.target.closest('input, textarea, canvas')) { start.current = null; return; }
      const p = e.touches[0]; start.current = { x: p.clientX, y: p.clientY };
    },
    onTouchEnd: (e) => {
      if (!start.current) return;
      const p = e.changedTouches[0];
      const dx = p.clientX - start.current.x, dy = p.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? onLeft : onRight)();
    },
  };
}

// ← / → on a keyboard, except while typing (an answer box or the code
// editor needs its arrow keys for the cursor).
export function useArrowKeys(onPrev, onNext) {
  const ref = useRef({ onPrev, onNext });
  ref.current = { onPrev, onNext };
  useEffect(() => {
    const h = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'ArrowLeft') ref.current.onPrev();
      else if (e.key === 'ArrowRight') ref.current.onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
}
