import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', skills: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    setError('');
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        profile: { skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) },
      });
      nav('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="card auth-card">
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Name" value={form.name} onChange={set('name')} />
      <input placeholder="Email" value={form.email} onChange={set('email')} />
      <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={set('password')} />
      <input placeholder="Skills (comma separated: react, node)" value={form.skills} onChange={set('skills')} />
      <button onClick={submit}>Sign up</button>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}
