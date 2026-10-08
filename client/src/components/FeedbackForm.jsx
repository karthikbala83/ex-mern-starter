// ---------------------------------------------------------------
// Feedback form — used by the /feedback page AND the floating
// "Feedback" button that is on every screen.
//
// The student only chooses a type and writes. WHERE they were and ON
// WHAT device is attached automatically: "the video stopped" is useless
// to the admin without "Statistics, Watch step, Android Chrome".
//
// These limits are DELIBERATE copies of the ones in models/Feedback.js.
// Duplication in validation is the one place it's correct: the client
// copy is for fast feedback while typing, the server copy is the rule.
// If they ever disagree, the server wins — that's the whole point.
// ---------------------------------------------------------------
import { useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext.jsx';

const MIN = 10;
const MAX = 1000;

// Order = how often we expect them. Idea vs feature is on purpose:
// an idea is a different way of doing something; a feature is a
// nice-to-have addition. Same keys as Feedback.TYPES on the server.
export const FEEDBACK_TYPES = [
  { id: 'bug',     emoji: '🐞', en: 'Bug',            ta: 'Bug',                hint: { en: 'Something broke or looks wrong', ta: 'ஏதோ வேலை செய்யல / தப்பா தெரியுது' } },
  { id: 'feature', emoji: '✨', en: 'Feature',        ta: 'Feature',            hint: { en: 'A nice-to-have addition or enhancement', ta: 'இருந்தா நல்லா இருக்கும்னு ஒரு புது வசதி' } },
  { id: 'idea',    emoji: '💡', en: 'Idea',           ta: 'Idea',               hint: { en: 'A different way to teach or do something', ta: 'ஒன்னை வேற மாதிரி செய்யலாம்னு ஒரு யோசனை' } },
  { id: 'content', emoji: '📚', en: 'Lesson content', ta: 'பாட உள்ளடக்கம்',      hint: { en: 'A mistake or confusing part in a lesson', ta: 'பாடத்துல தப்பு அல்லது புரியாத இடம்' } },
  { id: 'other',   emoji: '💬', en: 'Other',          ta: 'மற்றவை',              hint: { en: 'Anything else', ta: 'வேற எதுவானாலும்' } },
];

// Where the student is, read from the URL. Lessons are /enovix/:id/:step,
// missions /missions/:id — enough for the admin to open the same screen.
export function pageContext(pathname) {
  const lesson = pathname.match(/^\/enovix\/([^/]+)\/([^/]+)/);
  if (lesson && lesson[1] !== 'check') return { lesson: lesson[1], step: lesson[2] };
  const mission = pathname.match(/^\/missions\/([^/]+)/);
  if (mission) return { lesson: `mission:${mission[1]}` };
  return {};
}

export default function FeedbackForm({ lang = 'en', onSent, compact = false }) {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const ta = lang === 'ta';

  // Derived from state on every render — not stored in a second useState.
  // Two states that must agree is two states that eventually won't.
  const len = message.trim().length;
  const tooShort = len < MIN;
  const valid = Boolean(type) && !tooShort && message.length <= MAX;

  const submit = async () => {
    if (!valid || busy) return;
    setError(''); setBusy(true);
    try {
      await api.post('/feedback', {
        type,
        message: message.trim(),
        rating: rating || undefined,          // optional: a bug report needs no stars
        page: (window.location.pathname + window.location.search).slice(0, 200),
        ...pageContext(window.location.pathname),
        device: navigator.userAgent.slice(0, 300),
      });
      toast(ta ? 'நன்றி! உங்க feedback admin-க்கு போயிடுச்சு.' : 'Thanks! Your feedback reached the team.', 'success');
      setType(''); setMessage(''); setRating(0);
      onSent?.();
    } catch (err) {
      // 429 from the hand-rolled rate limit lands here, with the minutes left.
      setError(err.response?.data?.message || (ta ? 'அனுப்ப முடியல. மறுபடியும் try பண்ணுங்க.' : 'Could not send. Please try again.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={'fb-form' + (compact ? ' compact' : '')}>
      <p className="fb-label" lang={lang}>{ta ? 'இது எதைப் பத்தி?' : 'What is this about?'}</p>
      <div className="fb-types" role="radiogroup" aria-label="Feedback type">
        {FEEDBACK_TYPES.map((tp) => (
          <button key={tp.id} type="button" role="radio" aria-checked={type === tp.id}
            className={'fb-type' + (type === tp.id ? ' on' : '')} onClick={() => setType(tp.id)}
            aria-label={`${tp[lang]}: ${tp.hint[lang]}`} title={tp.hint[lang]}>
            <span aria-hidden="true">{tp.emoji}</span> <span lang={lang}>{tp[lang]}</span>
          </button>
        ))}
      </div>
      {type && <p className="muted" lang={lang}>{FEEDBACK_TYPES.find((tp) => tp.id === type).hint[lang]}</p>}

      <textarea rows={compact ? 4 : 5} maxLength={MAX} value={message} onChange={(e) => setMessage(e.target.value)}
        aria-label="Feedback message" lang={lang}
        placeholder={type === 'bug'
          ? (ta ? 'என்ன ஆச்சு? நீங்க என்ன பண்ணும்போது?' : 'What happened? What were you doing when it happened?')
          : (ta ? `உங்க feedback (குறைஞ்சது ${MIN} எழுத்துக்கள்)` : `Your feedback (at least ${MIN} characters)`)} />
      {/* A live counter turns an invisible rule into something you can see. */}
      <p className={tooShort && len > 0 ? 'error' : 'muted'}>
        {len} / {MAX}{tooShort && len > 0 && ` — ${MIN - len} ${ta ? 'இன்னும் வேணும்' : 'more to go'}`}
      </p>

      <p className="fb-label" lang={lang}>{ta ? 'மொத்தமா எப்படி இருக்கு? (விருப்பம்)' : 'Overall, how is it going? (optional)'}</p>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" className={`star ${n <= rating ? 'on' : ''}`}
            onClick={() => setRating(n === rating ? 0 : n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={n <= rating}>★</button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      <button onClick={submit} disabled={!valid || busy}>{busy ? (ta ? 'அனுப்புது…' : 'Sending…') : (ta ? 'அனுப்பு' : 'Send feedback')}</button>
      <p className="muted" lang={lang}>
        {ta ? 'நீங்க இருக்கிற page-உம் உங்க phone/browser விவரமும் தானா சேர்க்கப்படும்.' : 'The page you are on and your phone/browser type are attached automatically.'}
      </p>
    </div>
  );
}
