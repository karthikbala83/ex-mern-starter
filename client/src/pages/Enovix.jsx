import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMenuBook, MdPlayArrow } from 'react-icons/md';
import api from '../api/axios';
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
// Tamil to match Lesson.jsx.
//
// ---- BOTH VERSIONS ARE OPEN ON PURPOSE ----
// Each lesson exists as version A (applications-first) and B (life-first),
// and during the pilot anyone can open either. That is a deliberate choice
// for this phase: students and professors are being asked which one they
// prefer, so they have to be able to see both and go back and forth.
// Once that review is in, the plan is to keep a single version and this
// card collapses to one button.
//
// Worth knowing when reading the results: because students choose, the
// two groups are self-selected rather than randomly assigned, so treat
// version comparisons as a preference signal — not proof that one
// version teaches better. The pre/post scores still measure whether the
// lesson works; they just cannot cleanly attribute a difference to A vs B.
// ---------------------------------------------------------------
export default function Enovix() {
  const [lang, setLang] = useState('ta');
  const [mine, setMine] = useState(null);      // concept-check progress, for the CTA label
  const [offline, setOffline] = useState(false);

  const t = (v) => (typeof v === 'string' ? v : v?.[lang] ?? '');

  // Only the concept-check button depends on this call. The lesson links
  // below never do, so a sleeping server can no longer block learning.
  useEffect(() => {
    let cancelled = false;
    api.get('/lesson-feedback/mine')
      .then((r) => { if (!cancelled) setMine(r.data); })
      .catch((e) => { if (!cancelled && e.response?.status !== 401) setOffline(true); });
    return () => { cancelled = true; };
  }, []);

  // The WHOLE label is translated, not just the noun. Translating half a
  // sentence ("Learn with பதிப்பு A") reads worse than leaving it in one
  // language — word order differs between English and Tamil, so a shared
  // prefix plus a translated suffix cannot come out right in both.
  const VERSION_LABEL = {
    A: { en: 'Learn with Version A', ta: 'பதிப்பு A உடன் கற்க' },
    B: { en: 'Learn with Version B', ta: 'பதிப்பு B உடன் கற்க' },
  };

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

      {Object.values(lessons).map((l) => {
        const versions = Object.keys(l.scenes ?? {});          // ['A', 'B']
        return (
          <div key={l.id} className="card lesson-card">
            <span className="home-emoji"><MdMenuBook /></span>
            <h3 lang={lang}>{t(l.title)}</h3>
            {l.breadcrumb && <p className="muted">{t(l.breadcrumb)}</p>}

            <div className="version-row">
              {versions.map((v) => (
                <Link key={v} to={`/enovix/${l.id}?v=${v}`} className={`version-btn version-${v}`} lang={lang}>
                  <MdPlayArrow aria-hidden="true" />
                  {t(VERSION_LABEL[v]) || `Version ${v}`}
                </Link>
              ))}
            </div>

            <p className="muted version-hint" lang={lang}>
              {lang === 'ta'
                ? 'ஒரே பாடம், இரண்டு விதமாக. இரண்டையும் பாருங்கள் — உங்களுக்கு எது பிடித்தது என்பதே நாங்கள் வைத்துக்கொள்ளும் பதிப்பை தீர்மானிக்கும்.'
                : 'Two ways of telling the same lesson. Try both and tell us which one you liked — your answer decides the version we keep.'}
            </p>
          </div>
        );
      })}

      <div className="card">
        <h3>Help us improve</h3>
        <p className="muted">
          The quick concept check before and after a lesson is how we find out
          which version actually teaches better — and it decides how every
          future lesson gets made.
        </p>
        {offline ? (
          <p className="error">
            The concept check is unavailable right now — the lessons above still work.
          </p>
        ) : (
          <Link to="/enovix/check" className="fb-open">
            {mine?.post?.at ? 'Your answers' : mine ? 'Continue the concept check' : 'Start the concept check'}
          </Link>
        )}
      </div>
    </div>
  );
}
