import { useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext.jsx';

// ---------------------------------------------------------------
// Feedback form.
// These limits are DELIBERATE copies of the ones in models/Feedback.js.
// Duplication in validation is the one place it's correct: the client
// copy is for fast feedback while typing, the server copy is the rule.
// If they ever disagree, the server wins — that's the whole point.
// ---------------------------------------------------------------
const MIN = 10;
const MAX = 500;

export default function Feedback() {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  // Derived from state on every render — not stored in a second useState.
  // Two states that must agree is two states that eventually won't.
  const tooShort = message.trim().length < MIN;
  const valid = !tooShort && message.length <= MAX && rating >= 1;

  const submit = async () => {
    setError('');
    if (!valid) return setError(`Write at least ${MIN} characters and pick a rating.`);
    try {
      await api.post('/feedback', { message: message.trim(), rating });
      setSent(true);
      toast('Thanks for the feedback!', 'success');
    } catch (err) {
      // 429 from the hand-rolled rate limit lands here, with the minutes left.
      setError(err.response?.data?.message || 'Could not send feedback');
    }
  };

  if (sent)
    return (
      <div className="card">
        <h2>Thanks!</h2>
        <p className="muted">Your feedback reached the admin dashboard.</p>
      </div>
    );

  return (
    <div className="card">
      <h2>Send feedback</h2>

      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${n <= rating ? 'on' : ''}`}
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        rows="5"
        maxLength={MAX}
        placeholder={`What should we improve? (at least ${MIN} characters)`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* A live counter turns an invisible rule into something you can see. */}
      <p className={tooShort ? 'error' : 'muted'}>
        {message.trim().length} / {MAX} characters
        {tooShort && ` — ${MIN - message.trim().length} more to go`}
      </p>

      {error && <p className="error">{error}</p>}
      <button onClick={submit} disabled={!valid}>Send</button>
      <p className="muted">You can send one piece of feedback per hour.</p>
    </div>
  );
}
