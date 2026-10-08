// ---------------------------------------------------------------
// "Sign in with Google".
//
// Google Identity Services draws the button and runs the popup. When the
// student picks an account, Google hands US an ID token (a signed JWT
// saying "this is priya@gmail.com, verified"). We do not trust it here —
// the browser can be lied to — we POST it to /api/auth/google, and the
// SERVER checks Google's signature (server/utils/googleToken.js). After
// that it is an ordinary login: our own JWT, our own session.
//
// No npm package: Google's script is loaded from Google, once, only on the
// pages that show the button. No client id at build time -> no button,
// and email/password login works exactly as before.
// ---------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { takeReturnPath } from '../api/axios';
import ServerWaking from './ServerWaking.jsx';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let gsiPromise = null;
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = resolve;
      s.onerror = () => { gsiPromise = null; reject(new Error('Could not load Google sign-in')); };
      document.head.appendChild(s);
    });
  }
  return gsiPromise;
}

export default function GoogleButton({ referralCode, text = 'continue_with' }) {
  const slot = useRef(null);
  const { googleLogin } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // The callback is registered once; a ref keeps it seeing the latest code.
  const refCode = useRef(referralCode);
  refCode.current = referralCode;

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    loadGoogleScript().then(() => {
      if (cancelled || !slot.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async ({ credential }) => {
          setError(''); setBusy(true);
          try {
            await googleLogin(credential, refCode.current);
            nav(takeReturnPath() || '/home', { replace: true });
          } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
            setBusy(false);
          }
        },
      });
      window.google.accounts.id.renderButton(slot.current, {
        theme: 'outline', size: 'large', shape: 'pill', text,
        // Google's button has a fixed pixel width; match the form's width.
        width: Math.min(400, slot.current.offsetWidth || 320),
      });
    }).catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CLIENT_ID) return null;
  return (
    <div className="google-signin">
      <div className="or-line"><span>or</span></div>
      <div ref={slot} className="google-slot" aria-busy={busy} />
      {busy && <p className="muted">Signing you in with Google…</p>}
      {error && <p className="error">{error}</p>}
      {/* The server may be asleep (Render free tier): say so after a few seconds. */}
      <ServerWaking active={busy} />
    </div>
  );
}
