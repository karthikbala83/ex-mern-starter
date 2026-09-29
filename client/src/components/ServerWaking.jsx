import { useEffect, useState } from 'react';

// ---------------------------------------------------------------
// Shown while a sign-in / sign-up request is in flight.
//
// The design problem: on Render's free tier the first request after a
// quiet spell takes ~50 seconds while the instance restarts. Fifty
// seconds of a silent screen is indistinguishable from a broken app —
// students press the button again, and again, and each press is another
// request. So the fix is not only an animation, it is TELLING THEM WHAT
// IS HAPPENING and roughly how long it will take.
//
// Three deliberate choices:
//
//  * Nothing appears for the first QUIET_MS. A warm server answers in
//    well under a second, and flashing "waking up the server" at someone
//    whose login was instant just invents a problem they did not have.
//
//  * The message escalates with elapsed time. "Still waking up" after 20
//    seconds is reassurance that we know it is slow; a message frozen
//    since second 5 reads like the page has hung.
//
//  * The bar creeps toward 95% over ~50s and then holds, pulsing. It is
//    an estimate, not a measurement — we cannot know when the server
//    will answer — so it must never sit at 100% while nothing happens.
//    Honest approximation beats a fake certainty.
//
// Pure CSS animation on purpose: this renders on the very first screen
// every visitor sees, and pulling an animation library into that bundle
// to draw a progress bar would cost more than it is worth.
// ---------------------------------------------------------------
const QUIET_MS = 5000;        // say nothing before this — most logins are instant
const EXPECTED_WAKE_S = 50;   // Render's own published cold-start figure

const MESSAGES = [
  { after: 0,  text: 'Waking up the server…',
    detail: 'Our free hosting sleeps after 15 minutes of no use. This can take up to a minute.' },
  { after: 20, text: 'Still waking up — nearly there.',
    detail: 'Only the first person to arrive waits. It will be instant for everyone after you.' },
  { after: 45, text: 'Taking longer than usual.',
    detail: 'Please keep waiting a few more seconds, or try again if nothing happens.' },
];

export default function ServerWaking({ active }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) { setElapsed(0); return; }

    const startedAt = Date.now();
    // 500ms is plenty for a seconds counter and costs nothing; a 60fps
    // timer here would be a waste for text that changes once a second.
    const id = setInterval(() => setElapsed(Math.round((Date.now() - startedAt) / 1000)), 500);
    return () => clearInterval(id);        // cleanup — StrictMode runs this twice
  }, [active]);

  if (!active || elapsed * 1000 < QUIET_MS) return null;

  // Last message whose threshold we have passed.
  const msg = [...MESSAGES].reverse().find((m) => elapsed >= m.after) ?? MESSAGES[0];
  const pct = Math.min(95, Math.round((elapsed / EXPECTED_WAKE_S) * 95));

  return (
    <div className="waking" role="status" aria-live="polite">
      <div className="waking-dots" aria-hidden="true"><span /><span /><span /></div>
      <p className="waking-text">{msg.text}</p>
      <p className="waking-detail">{msg.detail}</p>
      <div className="waking-bar" aria-hidden="true">
        <div className="waking-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="waking-count">{elapsed}s</p>
    </div>
  );
}
