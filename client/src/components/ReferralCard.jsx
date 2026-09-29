import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext.jsx';

// ---------------------------------------------------------------
// Referral card — your code, your share link, and who you brought in.
// ---------------------------------------------------------------
export default function ReferralCard() {
  const [data, setData] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    api.get('/users/referral')
      .then((r) => { if (!cancelled) setData(r.data); })
      .catch(() => {});
    return () => { cancelled = true; };   // don't setState on an unmounted component
  }, []);

  const share = async () => {
    // navigator.share opens the real OS share sheet — but it only exists on
    // mobile and on HTTPS. Feature-DETECT it, never sniff the user agent,
    // and always ship the fallback: on a laptop, copying is the share.
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Campus Arena', url: data.link });
      } else {
        await navigator.clipboard.writeText(data.link);
        toast('Link copied!', 'success');
      }
    } catch {
      // The user closing the share sheet rejects the promise. That's a
      // cancellation, not a failure — say nothing.
    }
  };

  if (!data) return null;

  return (
    <div className="card">
      <h3>Invite your friends</h3>
      <p className="muted">Anyone who signs up with your link shows up here.</p>

      <div className="ref-row">
        <code className="ref-code">{data.code}</code>
        <button onClick={share}>Share link</button>
      </div>

      <p className="muted">You have invited <strong>{data.count}</strong> people.</p>
      <ul className="ref-list">
        {data.invited.map((u) => (
          <li key={u.name + u.joinedAt}>
            {u.name} <span className="muted">· {new Date(u.joinedAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
