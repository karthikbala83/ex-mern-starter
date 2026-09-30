// /enovix/:id?v=…  — Watch → Try it yourself → Code lab → Quiz → Missions.
//
// Two kinds of lesson share this page:
//   probability  three story versions (A/B/C) from the pilot; ?v=C is the
//                code lab only, and that behaviour must not change.
//   sincos-a/b/c one story under the key 'main', plus practice problems.
// Rather than special-casing lesson ids, the page asks each lesson what it
// has: versions come from narration.versions, practice renders when
// lesson.practice exists, prev/next when the lesson names them.
import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { lessons } from '../lessons/index.js';
import { allLessons } from '../missions/catalog.js';
import LessonPlayer from '../components/LessonPlayer.jsx';
import CodeLab from '../components/CodeLab.jsx';
import Practice from '../components/Practice.jsx';

// Bilingual text may be a plain string or { en, ta }; fall back to English.
const t = (v, lang) => (typeof v === 'string' ? v : v?.[lang] ?? v?.en ?? '');

function Quiz({ quiz, lang }) {
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState(false);
  const score = quiz.filter((q, i) => picked[i] === q.a).length;
  return (
    <div>
      {quiz.map((q, i) => (
        <div className={'card quiz-q ' + (checked ? (picked[i] === q.a ? 'ok' : 'bad') : '')} key={i}>
          <p lang={lang}><b>{i + 1}. {q.q[lang]}</b></p>
          {q.o.map((o, j) => (
            <label key={j} className="fb-opt"><input type="radio" name={'q' + i} checked={picked[i] === j} onChange={() => { setPicked({ ...picked, [i]: j }); setChecked(false); }} /><span>{o}</span></label>
          ))}
          {checked && <p className="quiz-fb" lang={lang}>{picked[i] === q.a ? '✓ ' : '✗ '}{q.e[lang]}</p>}
        </div>
      ))}
      <button disabled={Object.keys(picked).length < quiz.length} onClick={() => setChecked(true)}>Check answers</button>
      {checked && <b style={{ marginLeft: 12 }}>{score} / {quiz.length}</b>}
    </div>
  );
}

// ---- The bridge from concept to mission ----
// A lesson teaches the idea; its missions make the student use it. The pairing
// already exists in the mission catalogue, so we read it from there instead of
// repeating it in the lesson files — one source, and a mission that opens later
// appears here automatically.
function MissionsForLesson({ lessonId, lang }) {
  const entry = allLessons.find((l) => l.id === lessonId);
  const missions = entry?.missions ?? [];
  if (missions.length === 0) return null;

  return (
    <section>
      <h3 className="lesson-h">5. Now build it</h3>
      <p className="muted">
        You have seen the idea. These missions ask you to write it — one function each.
      </p>
      <div className="lesson-missions">
        {missions.map((m) => {
          const label = `${m.product === 'game' ? '🎮' : '🏢'} ${t(m.title, lang)}`;
          return m.status === 'live'
            ? <Link key={m.id} to={`/missions/${m.id}`} className="chip chip-live">▶ {label}</Link>
            : <span key={m.id} className="chip chip-soon">🔒 {label} · Coming soon</span>;
        })}
      </div>
    </section>
  );
}

function PrevNext({ lesson, lang }) {
  if (!lesson.prev && !lesson.next) return null;
  // Prefer the short "Part B" over the full sentence title — see index.js.
  const nameOf = (id) => lessons[id]?.part ?? t(lessons[id]?.title, lang) ?? id;
  return (
    <div className="lesson-nav">
      {lesson.prev
        ? <Link className="lp-ghost" to={`/enovix/${lesson.prev}`}>← {nameOf(lesson.prev)}</Link>
        : <span />}
      {lesson.next && <Link className="fb-open" to={`/enovix/${lesson.next}`}>{nameOf(lesson.next)} →</Link>}
    </div>
  );
}

export default function Lesson() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const lesson = lessons[id];
  const [lang, setLang] = useState('ta');
  if (!lesson) return <p>Lesson not found. <Link to="/enovix">Back to Enovix</Link></p>;

  // ---- Which story to play ----
  // Ask the lesson's own narration what versions exist rather than hard-coding
  // ['A','B','C']. A lesson with only 'main' then needs no special case, and
  // adding a version later needs no edit here.
  const asked = params.get('v');
  const versions = lesson.narration.versions;
  const v = asked && Object.hasOwn(versions, asked) ? asked : lesson.defaultVersion;
  const story = versions[v];

  // Pilot compatibility: probability's ?v=C means "code lab only", and there
  // is no 'C' story to play. Scoped to probability so a future lesson with a
  // real version C is not silently stripped of its story.
  const labOnly = id === 'probability' && asked === 'C';
  const showStory = Boolean(story) && !labOnly;

  // A version label may be a plain string or { en, ta }. Show it only when it
  // tells the reader something true:
  //   - one version only  -> "Story" answers a question nobody asked;
  //   - labOnly (?v=C)    -> `story` fell back to the DEFAULT version, so its
  //     label would claim "Life first" on a page that plays no story at all.
  const versionLabel = !labOnly && Object.keys(versions).length > 1 ? t(story?.label, lang) : '';

  return (
    <div className="lesson">
      <p className="muted">{lesson.breadcrumb}</p>
      <div className="lesson-top">
        <h2 lang={lang}>
          {t(lesson.title, lang)}
          {versionLabel && <span className="badge">{versionLabel}</span>}
        </h2>
        <div className="seg" role="group" aria-label="Language">
          <button aria-pressed={lang === 'ta'} onClick={() => setLang('ta')} lang="ta">தமிழ்</button>
          <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
        </div>
      </div>

      {showStory && (
        <section>
          <h3 className="lesson-h">1. Watch</h3>
          <LessonPlayer lessonId={lesson.id} version={v} story={story} createScenes={lesson.scenes[v]} lang={lang} />
          <PrevNext lesson={lesson} lang={lang} />
        </section>
      )}

      {lesson.practice && (
        <section>
          <h3 className="lesson-h">2. Try it yourself</h3>
          <p className="muted">
            Paper-and-pen problems, the kind that turn up in exams and aptitude rounds.
          </p>
          <Practice problems={lesson.practice} lang={lang} />
        </section>
      )}

      <section id="lab">
        <h3 className="lesson-h">{showStory ? '3. Try it in code' : 'Code lab'}</h3>
        <CodeLab createLab={lesson.createLab} lang={lang} />
      </section>

      <section>
        <h3 className="lesson-h">{showStory ? '4. Check yourself' : 'Check yourself'}</h3>
        <Quiz quiz={lesson.quiz} lang={lang} />
      </section>

      <MissionsForLesson lessonId={lesson.id} lang={lang} />

      <PrevNext lesson={lesson} lang={lang} />
    </div>
  );
}
