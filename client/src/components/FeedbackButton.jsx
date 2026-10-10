// ---------------------------------------------------------------
// Feedback — an icon in the header, next to Refer a friend and the bell.
//
// It used to float in the bottom-right corner, where on a phone it sat on
// top of the lesson's "Next" button: a secondary feature covering the
// primary action. In the header it is always one tap away and never in
// the way. The report still attaches the page the student was on.
//
// The dialog is a real modal:
//   - rendered into document.body (a portal) and the app behind it is made
//     `inert`, so Tab / Shift+Tab cannot wander off into the page;
//   - Esc closes it, and focus goes back to the icon that opened it, so a
//     keyboard user is exactly where they were.
// ---------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdFeedback, MdClose } from 'react-icons/md';
import { useLang } from '../lessons/progress.js';
import FeedbackForm from './FeedbackForm.jsx';

export default function FeedbackButton() {
  const [lang] = useLang();
  const [open, setOpen] = useState(false);
  const opener = useRef(null);
  const panel = useRef(null);
  const ta = lang === 'ta';

  useEffect(() => {
    if (!open) return;
    const root = document.getElementById('root');
    root?.setAttribute('inert', '');            // everything behind the dialog: unreachable
    panel.current?.querySelector('button, textarea')?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      root?.removeAttribute('inert');
      window.removeEventListener('keydown', onKey);
      opener.current?.focus();                  // back where they started
    };
  }, [open]);

  return (
    <span className="bell-wrap">
      <button ref={opener} className="link-btn bell" onClick={() => setOpen(true)}
        aria-label="Send feedback" title="Send feedback" aria-haspopup="dialog">
        <MdFeedback aria-hidden="true" />
      </button>
      {open && createPortal(
        <div className="fb-sheet-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="fb-sheet card" role="dialog" aria-modal="true" aria-labelledby="fb-sheet-title" ref={panel}>
            <div className="fb-sheet-head">
              <h3 id="fb-sheet-title" lang={lang}>{ta ? 'Feedback அனுப்புங்க' : 'Send feedback'}</h3>
              <button className="fb-sheet-close" onClick={() => setOpen(false)} aria-label="Close" title="Close"><MdClose aria-hidden="true" /></button>
            </div>
            <FeedbackForm lang={lang} compact onSent={() => setOpen(false)} />
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}
