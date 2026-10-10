import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import ServerWaking from '../components/ServerWaking.jsx';
import GoogleButton from '../components/GoogleButton.jsx';
import { warmUpApi, takeReturnPath } from '../api/axios';

// ---------------------------------------------------------------
// Password rules — one small regex per rule, not one monster.
// Each rule maps to one checklist line, so students SEE what
// each regex does as they type.
// Remember: client-side validation is UX. The SERVER must
// validate too — never trust the browser.
// ---------------------------------------------------------------
const RULES = [
  { id: 'len',     label: 'At least 8 characters',            test: (p) => /.{8,}/.test(p) },
  { id: 'upper',   label: 'One uppercase letter (A-Z)',       test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'One lowercase letter (a-z)',       test: (p) => /[a-z]/.test(p) },
  { id: 'digit',   label: 'One number (0-9)',                 test: (p) => /\d/.test(p) },
  { id: 'special', label: 'One special character (@$!%*?&#)', test: (p) => /[@$!%*?&#]/.test(p) },
];

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', skills: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // ---- Referral link: /signup?ref=A79st54H ----
  // useSearchParams reads the query string from the URL. The code is never
  // typed by the user, so it stays out of `form` state — it is data the LINK
  // carried, not a field. A missing ?ref simply gives undefined, and the
  // server treats that the same as a wrong code: signup proceeds regardless.
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || undefined;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Re-runs on every keystroke because state changed -> re-render.
  // This IS "UI = function(state)" in action.
  const results = RULES.map((r) => ({ ...r, ok: r.test(form.password) }));
  const allValid = results.every((r) => r.ok);

  // Same warm-up as Login — a new student typing their details is free
  // time we can spend starting the server.
  useEffect(() => { warmUpApi(); }, []);

  const submit = async () => {
    if (busy) return;
    setError('');
    if (!allValid) return setError('Password does not meet all the rules below');
    setBusy(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        profile: { skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) },
        referralCode,
      });
      // A shared lesson link should land on that lesson, even for a brand-new account.
      nav(takeReturnPath() || '/home', { replace: true });
      // Stays disabled on success — see the note in Login.jsx. Double
      // submitting a signup is worse than a double login: the second one
      // fails on the unique email index and shows the new student an
      // "Email already registered" error for the account they just made.
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form">
      <h2>Create account</h2>
      <p className="auth-hint">One minute, and you're on the leaderboard.</p>
      {/* Show the invite so it doesn't feel like a hidden tracker */}
      {referralCode && (
        <p className="info">You were invited! Code <code>{referralCode}</code> applied.</p>
      )}
      {error && <p className="error">{error}</p>}
      <input placeholder="Name" value={form.name} onChange={set('name')} />
      <input placeholder="Email" value={form.email} onChange={set('email')} />
      <PasswordInput value={form.password} onChange={set('password')} />

      {/* Live checklist — appears once the user starts typing */}
      {form.password && (
        <ul className="pw-rules">
          {results.map((r) => (
            <li key={r.id} className={r.ok ? 'rule ok' : 'rule bad'}>
              {r.ok ? '✓' : '○'} {r.label}
            </li>
          ))}
        </ul>
      )}

      <input placeholder="Skills — optional (react, node)" aria-label="Skills, optional" value={form.skills} onChange={set('skills')} />
      <button onClick={submit} disabled={busy || !allValid || !form.name || !form.email}>
        {busy ? 'Creating your account…' : 'Sign up'}
      </button>
      <ServerWaking active={busy} />

      {/* The invite code rides along: a friend who joins with Google still
          credits whoever shared the link. */}
      <GoogleButton text="signup_with" referralCode={referralCode} />
      <p>Already registered? <Link to="/login">Login</Link></p>
      </div>
    </AuthLayout>
  );
}
