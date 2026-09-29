import { useState } from 'react';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [devLink, setDevLink] = useState('');

  const submit = async () => {
    const { data } = await api.post('/auth/forgot-password', { email });
    setMessage(data.message);
    // In class we show the link directly; in production it goes by email.
    if (data.devResetLink) setDevLink(data.devResetLink);
  };

  return (
    <AuthLayout>
      <div className="auth-form">
      <h2>Forgot password</h2>
      <p className="auth-hint">We'll send you a link to set a new one.</p>
      {message && <p className="info">{message}</p>}
      {devLink && <p className="info">Dev link: <a href={devLink}>{devLink}</a></p>}
      <input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={submit}>Send reset link</button>
      </div>
    </AuthLayout>
  );
}
