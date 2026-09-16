import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    try {
      await login(email, password);
      nav('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card auth-card">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password}
             onChange={(e) => setPassword(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && submit()} />
      <button onClick={submit}>Login</button>
      <p><Link to="/forgot-password">Forgot password?</Link></p>
      <p>New here? <Link to="/signup">Create an account</Link></p>
    </div>
  );
}
