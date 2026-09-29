import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import ServerWaking from '../components/ServerWaking.jsx';
import { warmUpApi } from '../api/axios';

// ---------------------------------------------------------------
// ANIMATION TEASER (full GSAP + Lottie session coming next time)
// Two tiny effects:
//   1. Card slides up + fades in on page load
//   2. Card shakes when login fails (instant, wordless feedback)
// Notice: animation never blocks logic — it decorates it.
// ---------------------------------------------------------------
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const cardRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Runs once after the card first renders
  // useEffect(() => {
  //   gsap.from(cardRef.current, { y: 40, opacity: 0, duration: 0.6, ease: 'power2.out' });
  // }, []);

  useEffect(() => {
  const tween = gsap.fromTo(
    cardRef.current,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
  );
  return () => tween.kill();   // cleanup for StrictMode's double-run
}, []);

  const shake = () => {
    gsap.fromTo(cardRef.current, { x: -8 }, {
      x: 8, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x',
    });
  };

  // Start the server booting the moment this page appears, while the
  // student is still typing. See warmUpApi() for why this matters so much
  // on a free instance. Fire and forget — we never wait on it.
  useEffect(() => { warmUpApi(); }, []);

  const submit = async () => {
    if (busy) return;                // a second click would be a second login
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      nav('/home');                  // the fork: Fun Game or Enovix
      // NOTE: busy stays true on purpose. A `finally` here would re-enable
      // the button on success too, and there is a real gap between asking
      // to navigate and this component unmounting — long enough to flash
      // "Login" back and to accept a second click, which would sign in
      // twice and open a second session. Only a FAILURE hands the form back.
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      shake();                       // feel the failure, not just read it
      setBusy(false);                // they are staying here, so give the button back
    }
  };

  return (
    <AuthLayout>
      {/* cardRef stays on this inner div so the existing entrance tween and
          the failure shake keep animating the FORM, not the whole layout. */}
      <div className="auth-form" ref={cardRef}>
      <h2>Welcome back</h2>
      <p className="auth-hint">Sign in to enter the arena.</p>
      {error && <p className="error">{error}</p>}
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordInput value={password}
             onChange={(e) => setPassword(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && submit()} />
      <button onClick={submit} disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
      <ServerWaking active={busy} />
      <p><Link to="/forgot-password">Forgot password?</Link></p>
      <p>New here? <Link to="/signup">Create an account</Link></p>
      </div>
    </AuthLayout>
  );
}
