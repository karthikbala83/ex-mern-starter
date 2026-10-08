import { useEffect, useState } from 'react';
import { MdShare, MdContentCopy, MdGroupAdd } from 'react-icons/md';
import api from '../api/axios';
import { useToast } from '../context/ToastContext.jsx';

// ---------------------------------------------------------------
// Refer a friend — your code, your share link, and who you brought in.
// Shown on Home, Enovix and the Leaderboard: an invite card that only one
// page shows is an invite card most students never see.
// `compact` hides the list of names for the busier pages.
// ---------------------------------------------------------------
export default function ReferralCard({ compact = false, lang = 'en' }) {
  const [data, setData] = useState(null);
  const { toast } = useToast();
  const ta = lang === 'ta';

  useEffect(() => {
    let cancelled = false;
    api.get('/users/referral')
      .then((r) => { if (!cancelled) setData(r.data); })
      .catch(() => {});
    return () => { cancelled = true; };   // don't setState on an unmounted component
  }, []);

  // What lands in WhatsApp: a sentence AND the link, so the friend knows
  // what they are opening before they tap it.
  const text = ta
    ? 'Maths-ஐ app build பண்ணி கத்துக்கலாம் வா! என் link-ல join பண்ணு:'
    : 'Learn the maths behind real apps by building them. Join me:';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(data.link);
      toast(ta ? 'Link copy ஆச்சு!' : 'Link copied!', 'success');
    } catch {
      toast(data.link, 'info');            // clipboard blocked: at least show it
    }
  };

  const share = async () => {
    // navigator.share opens the real OS share sheet — but it only exists on
    // mobile and on HTTPS. Feature-DETECT it, never sniff the user agent,
    // and always ship the fallback: on a laptop, copying is the share.
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title: 'Enovix', text, url: data.link });
    } catch {
      // The user closing the share sheet rejects the promise. That's a
      // cancellation, not a failure — say nothing.
    }
  };

  if (!data) return null;
  return (
    <div className="card referral-card">
      <h3><MdGroupAdd aria-hidden="true" /> <span lang={lang}>{ta ? 'நண்பர்களை அழைங்க' : 'Refer a friend'}</span></h3>
      <p className="muted" lang={lang}>
        {ta ? 'உங்க link-ல join பண்றவங்க இங்க தெரிவாங்க.' : 'Anyone who signs up with your link shows up here.'}
      </p>
      <div className="ref-row">
        <code className="ref-code">{data.code}</code>
        <button onClick={share}><MdShare aria-hidden="true" /> {ta ? 'Share' : 'Share link'}</button>
        <button className="lp-ghost" onClick={copy} aria-label="Copy link" title="Copy link"><MdContentCopy aria-hidden="true" /> {ta ? 'Copy' : 'Copy'}</button>
      </div>
      <p className="muted" lang={lang}>
        {ta ? <>நீங்க <strong>{data.count}</strong> பேரை அழைச்சிருக்கீங்க.</> : <>You have invited <strong>{data.count}</strong> {data.count === 1 ? 'friend' : 'friends'}.</>}
      </p>
      {!compact && (
        <ul className="ref-list">
          {data.invited.map((u) => (
            <li key={u.name + u.joinedAt}>
              {u.name} <span className="muted">· {new Date(u.joinedAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
