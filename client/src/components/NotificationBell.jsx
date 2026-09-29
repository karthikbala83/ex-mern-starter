import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext.jsx';

const POLL_MS = 10000;   // same 10s rhythm as the admin dashboard

// ---------------------------------------------------------------
// The bell: polls for unseen notifications, shows a badge, and
// pops a toast the moment something NEW arrives.
// No WebSockets — polling is the honest version of "realtime",
// and it's what this codebase teaches before upgrading next session.
// ---------------------------------------------------------------
export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Which notification IDs have we already toasted about?
  // A ref because changing it must not re-render — and because it has to
  // survive across polls without becoming a dependency of the effect below.
  const announced = useRef(new Set());

  useEffect(() => {
    let cancelled = false;   // guards against a response landing after unmount

    const load = async () => {
      try {
        const { data } = await api.get('/notifications');
        if (cancelled) return;
        setItems(data.items);
        setCount(data.unseenCount);

        // Only toast about things we have not toasted about before,
        // otherwise every 10s poll would re-announce the same message forever.
        data.items.forEach((n) => {
          if (!announced.current.has(n._id)) {
            announced.current.add(n._id);
            toast(n.message, n.type === 'BEAT_SCORE' ? 'warn' : 'info');
          }
        });
      } catch {
        // A failed poll is not worth shouting about — the next one is 10s away.
      }
    };

    load();
    const id = setInterval(load, POLL_MS);

    // CLEANUP. Without this, StrictMode's double-mount leaves TWO intervals
    // running and you poll the server twice as often, forever.
    return () => { cancelled = true; clearInterval(id); };
  }, [toast]);

  const togglePanel = async () => {
    const next = !open;
    setOpen(next);

    // Opening the panel IS the "I have read these" signal.
    if (next && items.length) {
      await api.post('/notifications/seen', { ids: items.map((n) => n._id) });
      setCount(0);   // update the badge immediately — don't wait for the next poll
    }
  };

  return (
    <span className="bell-wrap">
      <button className="link-btn bell" onClick={togglePanel} title="Notifications">
        🔔{count > 0 && <span className="bell-badge">{count}</span>}
      </button>

      {open && (
        <div className="bell-panel">
          {items.length === 0 && <p className="muted">Nothing new.</p>}
          {items.map((n) => (
            <div key={n._id} className="bell-item">
              <span className={`badge ${n.type === 'BEAT_SCORE' ? 'high' : ''}`}>{n.type}</span>
              <p>{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </span>
  );
}
