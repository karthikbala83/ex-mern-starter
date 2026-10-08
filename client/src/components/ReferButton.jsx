// ---------------------------------------------------------------
// "Refer a friend" as a header icon, next to the notification bell.
//
// Inviting friends is an ACTION, not content: as a card on Home it read
// like an advert sitting between the student and their lessons. Up here
// it is one tap away on every page and out of the way otherwise.
//
// Same pattern as NotificationBell (button + panel + scrim), and the
// card is only mounted while the panel is open, so the referral API is
// called when someone actually looks, not on every page load.
// ---------------------------------------------------------------
import { useEffect, useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import { useLang } from '../lessons/progress.js';
import ReferralCard from './ReferralCard.jsx';

export default function ReferButton() {
  const [open, setOpen] = useState(false);
  const [lang] = useLang();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <span className="bell-wrap">
      <button className="link-btn bell" onClick={() => setOpen(!open)}
        aria-label="Refer a friend" title="Refer a friend" aria-expanded={open}>
        <MdPersonAdd aria-hidden="true" />
      </button>
      {open && (
        <>
          <button className="bell-scrim" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="bell-panel refer-panel">
            {/* Full card: this panel is now the one place to see who joined. */}
            <ReferralCard lang={lang} />
          </div>
        </>
      )}
    </span>
  );
}
