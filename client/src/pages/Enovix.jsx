import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMenuBook, MdPlayArrow } from 'react-icons/md';
import api from '../api/axios';
import { lessons } from '../lessons/index.js';
import { worlds } from '../missions/catalog.js';
import { useLang, readProgress, stepsFor, doneSteps } from '../lessons/progress.js';

// A small ring: how many of this lesson's steps are done. SVG, because a
// circle with a partial stroke is two <circle>s and one dasharray — no
// chart library needed for that.
function ProgressRing({ done, of }) {
  const r = 16, c = 2 * Math.PI * r;
  const frac = of ? done / of : 0;
  return (
    <span className={'ring' + (done === of && of ? ' full' : '')} title={`${done} of ${of} steps done`} aria-label={`${done} of ${of} steps done`} role="img">
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <circle cx="20" cy="20" r={r} className="ring-bg" />
        <circle cx="20" cy="20" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - frac)} transform="rotate(-90 20 20)" />
      </svg>
      <b>{done}/{of}</b>
    </span>
  );
}

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
// Tamil, and the choice is shared with every lesson step.
//
// ---- BOTH VERSIONS ARE OPEN ON PURPOSE ----
// The probability pilot exists as version A (applications-first) and B (life-first),
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
  // Shared with every lesson step (lessons/progress.js), so the language
  // picked here is the language the lesson opens in.
  const [lang, setLang] = useLang();
  const [mine, setMine] = useState(null);      // concept-check progress, for the CTA label
  const [offline, setOffline] = useState(false);
  const [missionProg, setMissionProg] = useState(null);   // only for the Missions ✓ in the rings

  const t = (v) => (typeof v === 'string' ? v : v?.[lang] ?? '');

  // Only the concept-check button depends on this call. The lesson links
  // below never do, so a sleeping server can no longer block learning.
  useEffect(() => {
    let cancelled = false;
    api.get('/lesson-feedback/mine')
      .then((r) => { if (!cancelled) setMine(r.data); })
      .catch((e) => { if (!cancelled && e.response?.status !== 401) setOffline(true); });
    // Same rule: rings still draw without it, just without the Missions step.
    api.get('/missions/progress').then((r) => { if (!cancelled) setMissionProg(r.data.missions); }).catch(() => {});
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
        const versions = Object.keys(l.scenes ?? {});          // ['A', 'B'] for the pilot, ['main'] after
        const steps = stepsFor(l);
        const done = doneSteps(l, readProgress(l.id), missionProg);
        const started = done.size > 0;
        return (
          <div key={l.id} className="card lesson-card">
            <div className="lesson-card-head">
              <span className="home-emoji"><MdMenuBook /></span>
              <ProgressRing done={steps.filter((s) => done.has(s)).length} of={steps.length} />
            </div>
            <h3 lang={lang}>{t(l.title)}</h3>
            {l.breadcrumb && <p className="muted">{t(l.breadcrumb)}</p>}

            <div className="version-row">
              {versions.length > 1
                ? versions.map((v) => (
                  <Link key={v} to={`/enovix/${l.id}/watch?v=${v}`} className={`version-btn version-${v}`} lang={lang}>
                    <MdPlayArrow aria-hidden="true" />
                    {t(VERSION_LABEL[v]) || `Version ${v}`}
                  </Link>
                ))
                : (
                  <Link to={`/enovix/${l.id}/watch`} className="version-btn version-B" lang={lang}>
                    <MdPlayArrow aria-hidden="true" />
                    {started ? (lang === 'ta' ? 'தொடர்ந்து கற்க' : 'Continue') : (lang === 'ta' ? 'கற்கத் தொடங்கு' : 'Start the lesson')}
                  </Link>
                )}
            </div>

            {/* Only the pilot has two versions to compare. */}
            {versions.length > 1 && (
              <p className="muted version-hint" lang={lang}>
                {lang === 'ta'
                  ? 'ஒரே பாடம், இரண்டு விதமாக. இரண்டையும் பாருங்கள் — உங்களுக்கு எது பிடித்தது என்பதே நாங்கள் வைத்துக்கொள்ளும் பதிப்பை தீர்மானிக்கும்.'
                  : 'Two ways of telling the same lesson. Try both and tell us which one you liked — your answer decides the version we keep.'}
              </p>
            )}
          </div>
        );
      })}

      {/* ---- The full journey (M7) ----
          Every lesson in the catalogue, not only the ones that are built.
          A student seeing 42 lessons across 7 worlds understands where this
          is going; showing only the one finished lesson makes the product
          look like it IS one lesson. Live ones link, the rest are honest
          about being unbuilt and name the missions they will unlock. */}
      <div className="card">
        <h3>The full journey</h3>
        <p className="muted">
          {worlds.reduce((n, w) => n + w.lessons.length, 0)} lessons across {worlds.length} worlds.
          We are building them one at a time — here is the whole map.
        </p>

        {worlds.map((w) => (
          <div key={w.id} className="journey-world">
            <h4>World {w.id} — <span lang={lang}>{t(w.title)}</span></h4>
            {w.lessons.map((l) => (
              <div key={l.id} className={`journey-row ${l.status === 'live' ? 'is-live' : 'is-soon'}`}>
                <div className="journey-title">
                  {l.status === 'live'
                    ? <Link to={l.route || `/enovix/${l.id}`} lang={lang}>{t(l.title)}</Link>
                    : <span lang={lang}>{t(l.title)}</span>}
                  {l.status === 'live'
                    ? <span className="badge">Open</span>
                    : <span className="badge">Coming soon</span>}
                </div>
                {l.missions.length > 0 && (
                  <p className="muted journey-missions">
                    {l.missions.map((m) => `${m.product === 'game' ? '🎮' : '🏢'} ${t(m.title)}`).join(' · ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

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
