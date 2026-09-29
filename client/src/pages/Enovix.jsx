import { useState } from 'react';
import { Link } from 'react-router-dom';
import { lessons } from '../lessons/index.js';

// ---------------------------------------------------------------
// Enovix landing: every lesson we have, as cards.
//
// `lessons` is an OBJECT keyed by id in src/lessons/index.js, so we take
// Object.values() to list them. Adding a lesson means adding data there —
// not editing this component.
//
// Every piece of lesson text is bilingual: { en: '...', ta: '...' }.
// Render `l.title` directly and React throws "Objects are not valid as a
// React child" — you must always pick a language first. We default to
// Tamil to match Lesson.jsx, and put the `lang` attribute on the element
// so screen readers and fonts switch with it.
// ---------------------------------------------------------------
export default function Enovix() {
  const [lang, setLang] = useState('ta');
  const t = (v) => (typeof v === 'string' ? v : v?.[lang] ?? '');

  return (
    <div>
      <div className="lesson-top">
        <div>
          <h2>Enovix</h2>
          <p className="muted">Learning with Fun — pick a lesson to begin.</p>
        </div>
        <div className="lang-switch">
          <button aria-pressed={lang === 'ta'} onClick={() => setLang('ta')} lang="ta">தமிழ்</button>
          <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
        </div>
      </div>

      <div className="home-grid">
        {Object.values(lessons).map((l) => (
          <Link key={l.id} to={`/enovix/${l.id}`} className="home-card home-card-learn">
            <span className="home-emoji">📘</span>
            <h3 lang={lang}>{t(l.title)}</h3>
            {l.breadcrumb && <p>{t(l.breadcrumb)}</p>}
            <span className="home-go">Open lesson →</span>
          </Link>
        ))}
      </div>

      <div className="card">
        <h3>Help us improve</h3>
        <p className="muted">
          Take the quick concept check before and after a lesson — it is how we
          find out which version actually teaches better.
        </p>
        <Link to="/enovix/check" className="fb-open">Start the concept check</Link>
      </div>
    </div>
  );
}
