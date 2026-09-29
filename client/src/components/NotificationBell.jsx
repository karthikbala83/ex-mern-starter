import { useEffect, useState, useRef, useCallback } from 'react';
import { MdNotifications } from 'react-icons/md';
import api from '../api/axios';
import { useToast } from '../context/ToastContext.jsx';

// ---------------------------------------------------------------
// The bell: unseen notifications, a badge, and a panel.
//
// WHY THERE IS NO setInterval HERE ANY MORE.
// It used to poll every 10 seconds. Do the arithmetic: 40 students with
// a tab open is 4 requests a second, all day, almost all of them
// returning "nothing new" — and on a free Render instance that is the
// difference between idle and always-on. Polling is only worth its cost
// when the data changes faster than the user checks.
//
// So we fetch on two events instead:
//   1. mount     — a page load or a route change (the "refresh" case)
//   2. focus     — the user comes back to the tab
// Coming back to a tab is exactly when someone looks at the bell, so it
// still feels live, and an idle tab now costs the server nothing at all.
// (When we want true real-time, the answer is WebSockets — not a faster
// poll. That is the next session.)
// ---------------------------------------------------------------
export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Which notification IDs have we already toasted about?
  // A ref because changing it must not trigger a re-render.
  const announced = useRef(new Set());
  const cancelled = useRef(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      if (cancelled.current) return;
      setItems(data.items);
      setCount(data.unseenCount);

      // Only toast about things we have not toasted about before.
      data.items.forEach((n) => {
        if (!announced.current.has(n._id)) {
          announced.current.add(n._id);
          toast(n.message, n.type === 'BEAT_SCORE' ? 'warn' : 'info');
        }
      });
    } catch {
      // A failed fetch is not worth shouting about.
    }
  }, [toast]);

  useEffect(() => {
    cancelled.current = false;
    load();

    // Refetch when the user returns to the tab. Both events are needed:
    // 'focus' covers alt-tabbing back, 'visibilitychange' covers mobile
    // where switching apps does not always fire focus.
    const onBack = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('focus', onBack);
    document.addEventListener('visibilitychange', onBack);

    return () => {
      cancelled.current = true;
      window.removeEventListener('focus', onBack);
      document.removeEventListener('visibilitychange', onBack);
    };
  }, [load]);

  const togglePanel = async () => {
    const next = !open;
    setOpen(next);

    // Opening the panel IS the "I have read these" signal.
    if (next && items.length) {
      await api.post('/notifications/seen', { ids: items.map((n) => n._id) });
      setCount(0);   // update the badge immediately
    }
  };

  return (
    <span className="bell-wrap">
      <button className="link-btn bell" onClick={togglePanel} aria-label="Notifications">
        <MdNotifications />
        {count > 0 && <span className="bell-badge">{count}</span>}
      </button>

      {open && (
        <>
          {/* Tapping anywhere else closes the panel. On a phone there is no
              "click outside" instinct without something to click, and this
              also stops the panel sitting on top of the page forever. */}
          <button className="bell-scrim" aria-label="Close notifications" onClick={() => setOpen(false)} />
          <div className="bell-panel">
            {items.length === 0 && <p className="muted">Nothing new.</p>}
            {items.map((n) => (
              <div key={n._id} className="bell-item">
                <span className={`badge ${n.type === 'BEAT_SCORE' ? 'high' : ''}`}>{n.type}</span>
                <p>{n.message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </span>
  );
}
