import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMenuBook, MdScience } from 'react-icons/md';
import api from '../api/axios';
import { lessons } from '../lessons/index.js';
import { useAuth } from '../context/AuthContext.jsx';

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
// ---- WHY STUDENTS DO NOT CHOOSE THEIR OWN VERSION ----
// Each lesson exists as version A (applications-first) and B (life-first).
// The whole point of the pilot is to find out which one teaches better, by
// comparing the same before/after concept check across the two groups.
// If students picked for themselves, the groups would differ by
// personality rather than by version and the comparison would mean
// nothing — that is self-selection bias, and it is the classic way to
// ruin an A/B test.
//
// So: the concept check assigns the version and records it, and this page
// sends a student to the version they were actually given. Teachers and
// admins get an explicit preview of both, because they need to see the
// material without being part of the experiment.
// ---------------------------------------------------------------
// Tiny stable string hash (djb2). Not cryptographic and does not need to be —
// it only has to give the SAME answer for the same id every time, and spread
// ids evenly across the buckets.
function hashToIndex(id, buckets) {
  if (!id || !buckets) return 0;
  let h = 5381;
  for (let i = 0; i < id.length; i++) h = ((h * 33) ^ id.charCodeAt(i)) >>> 0;
  return h % buckets;
}

export default function Enovix() {
  const [lang, setLang] = useState('ta');
  const [mine, setMine] = useState(null);      // this student's assigned version, if any
  const [loaded, setLoaded] = useState(false);
  const [offline, setOffline] = useState(false);   // could not reach the check service
  const { user } = useAuth();
  const isStaff = user?.role === 'admin';

  const t = (v) => (typeof v === 'string' ? v : v?.[lang] ?? '');

  useEffect(() => {
    let cancelled = false;
    api.get('/lesson-feedback/mine')
      .then((r) => { if (!cancelled) setMine(r.data); })
      .catch((e) => {
        // 401/empty just means "not started yet" — normal. Anything else means
        // the service is unreachable, and a student must NOT be locked out of
        // the lesson because a server is asleep.
        if (!cancelled && e.response?.status !== 401) setOffline(true);
      })
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

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
        {Object.values(lessons).map((l) => {
          const versions = Object.keys(l.scenes ?? {});           // ['A', 'B']
          // Normally: the concept check assigns the version and we honour it.
          // If the check service is unreachable we still let them learn, but we
          // pick the version FOR them from their user id rather than letting
          // them choose — a stable hash spreads students evenly across A and B
          // and keeps self-selection out of the data. Same student, same
          // version, every time.
          const fallback = versions[hashToIndex(user?.id, versions.length)] ?? 'B';
          const target = mine?.version
            ? `/enovix/${l.id}?v=${mine.version}`
            : offline
              ? `/enovix/${l.id}?v=${fallback}`
              : '/enovix/check';

          return (
            <div key={l.id} className="home-card home-card-learn">
              <span className="home-emoji"><MdMenuBook /></span>
              <h3 lang={lang}>{t(l.title)}</h3>
              {l.breadcrumb && <p>{t(l.breadcrumb)}</p>}

              {loaded && (
                <Link to={target} className="home-go">
                  {mine?.version
                    ? `Open lesson (version ${mine.version}) →`
                    : offline ? 'Open lesson →' : 'Start here →'}
                </Link>
              )}

              {offline && (
                <p className="muted">
                  The concept check is unavailable right now — the lesson still works.
                </p>
              )}

              {/* Staff only — students must not self-select, see the note above. */}
              {isStaff && versions.length > 0 && (
                <p className="staff-preview">
                  <MdScience aria-hidden="true" /> Preview:{' '}
                  {versions.map((v) => (
                    <Link key={v} to={`/enovix/${l.id}?v=${v}`}>version {v}</Link>
                  ))}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3>Help us improve</h3>
        <p className="muted">
          The quick concept check before and after a lesson is how we find out
          which version actually teaches better — and it decides how every
          future lesson gets made.
        </p>
        <Link to="/enovix/check" className="fb-open">
          {mine?.post?.at ? 'Your answers' : mine ? 'Continue the concept check' : 'Start the concept check'}
        </Link>
      </div>
    </div>
  );
}
