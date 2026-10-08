// ---------------------------------------------------------------
// The floating "Feedback" button — on every screen, for logged-in users.
//
// Beta testers report what they hit WHERE they hit it. Sending them to a
// separate page first loses the context (and half the reports), so the
// form opens as a sheet over the current screen, and that screen is what
// gets attached to the report.
// ---------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MdFeedback, MdClose } from 'react-icons/md';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../lessons/progress.js';
import FeedbackForm from './FeedbackForm.jsx';

export default function FeedbackButton() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [lang] = useLang();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Esc closes; focus moves into the sheet when it opens (keyboard users).
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector('button')?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Not where it would be redundant (the feedback page itself) or in the
  // way (admin screens), and never for signed-out visitors.
  if (!user || pathname.startsWith('/feedback') || pathname.startsWith('/admin')) return null;
  // Inside a lesson the Back/Next bar owns the bottom edge; sit above it.
  const inLesson = /^\/enovix\/[^/]+\/[^/]+/.test(pathname);
  const ta = lang === 'ta';

  return (
    <>
      <button className={'fb-fab' + (inLesson ? ' in-lesson' : '')} onClick={() => setOpen(true)}
        aria-label="Send feedback" title="Send feedback">
        <MdFeedback aria-hidden="true" /><span className="fb-fab-label">Feedback</span>
      </button>
      {open && (
        <div className="fb-sheet-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="fb-sheet card" role="dialog" aria-modal="true" aria-label="Send feedback" ref={panelRef}>
            <div className="fb-sheet-head">
              <h3 lang={lang}>{ta ? 'Feedback அனுப்புங்க' : 'Send feedback'}</h3>
              <button className="fb-sheet-close" onClick={() => setOpen(false)} aria-label="Close" title="Close"><MdClose aria-hidden="true" /></button>
            </div>
            <FeedbackForm lang={lang} compact onSent={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
