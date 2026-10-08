// ---------------------------------------------------------------
// /feedback — the same form as the floating button, as a full page,
// for students who come looking for it from the menu.
// ---------------------------------------------------------------
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../lessons/progress.js';
import FeedbackForm from '../components/FeedbackForm.jsx';

export default function Feedback() {
  const [lang, setLang] = useLang();
  const [sent, setSent] = useState(false);
  const ta = lang === 'ta';

  return (
    <div className="card">
      <div className="lesson-top">
        <h2 lang={lang}>{ta ? 'Feedback அனுப்புங்க' : 'Send feedback'}</h2>
        <div className="lang-switch">
          <button aria-pressed={ta} onClick={() => setLang('ta')} lang="ta">தமிழ்</button>
          <button aria-pressed={!ta} onClick={() => setLang('en')}>English</button>
        </div>
      </div>
      {sent ? (
        <>
          <p lang={lang}>{ta ? 'நன்றி! உங்க feedback admin-க்கு போயிடுச்சு.' : 'Thanks! Your feedback reached the team.'}</p>
          <p><button className="lp-ghost" onClick={() => setSent(false)}>{ta ? 'இன்னொன்னு அனுப்ப' : 'Send another'}</button> <Link to="/home">Home</Link></p>
        </>
      ) : (
        <>
          <p className="muted" lang={lang}>
            {ta ? 'Tip: எந்த page-லயும் கீழ வலது பக்கம் இருக்கிற Feedback button-ஐ தொடலாம். அந்த page-உம் சேர்ந்தே வரும்.'
                : 'Tip: the Feedback button at the bottom right of every page sends a report with that page attached.'}
          </p>
          <FeedbackForm lang={lang} onSent={() => setSent(true)} />
        </>
      )}
    </div>
  );
}
