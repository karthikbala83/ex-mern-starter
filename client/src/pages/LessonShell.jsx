// ---------------------------------------------------------------
// LessonShell — the learning environment, ONE STEP PER SCREEN.
//
//   /enovix/:id          -> redirect to /enovix/:id/watch   (LessonRedirect)
//   /enovix/:id/:step    step = watch | practice | lab | quiz | missions
//
// Why split one long page into screens? On the old page a student could
// see the quiz while the story was still playing, and on a phone the
// lesson was a scroll of 15 screens with no sense of "where am I". A
// stepper answers that question at a glance, and each step gets the
// whole screen.
//
// Why a URL per step (and not just React state)? A teacher can send
// "/enovix/statistics/lab" to start a class straight at the code lab,
// the browser Back button works, and a refresh lands where you were.
//
// The shell asks each lesson what it HAS (stepsFor in lessons/progress.js)
// instead of special-casing lesson ids: the probability pilot has no
// practice set, so its stepper simply has four steps.
// ---------------------------------------------------------------
import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdTranslate, MdPlayCircle, MdEditNote, MdCode, MdQuiz, MdRocketLaunch, MdCheck, MdReplay, MdLock, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import api from '../api/axios';
import { lessons } from '../lessons/index.js';
import { allLessons, products, worlds } from '../missions/catalog.js';
import { useLang, useLessonProgress, stepsFor, doneSteps, missionsOf, worldComplete, stepCounts, stepLocked } from '../lessons/progress.js';
import LessonPlayer from '../components/LessonPlayer.jsx';
import CodeLab from '../components/CodeLab.jsx';
import Practice from '../components/Practice.jsx';
import { Dots } from '../components/Pager.jsx';

// The trophy pulls in Lottie. Lazy, so only a student who scores well downloads it.
const Trophy = lazy(() => import('../components/Trophy.jsx'));

// Bilingual text may be a plain string or { en, ta }; fall back to English.
const t = (v, lang) => (typeof v === 'string' ? v : v?.[lang] ?? v?.en ?? '');

// `label` is what the stepper shows; `next` is how the Next button names
// the step ("Next: Try it yourself →" reads better than "Next: Practice").
const STEPS = {
  watch:    { label: 'Watch',    next: 'Watch',           Icon: MdPlayCircle },
  practice: { label: 'Practice', next: 'Try it yourself', Icon: MdEditNote },
  lab:      { label: 'Code lab', next: 'Code lab',        Icon: MdCode },
  quiz:     { label: 'Quiz',     next: 'Quiz',            Icon: MdQuiz },
  missions: { label: 'Missions', next: 'Missions',        Icon: MdRocketLaunch },
};

// ---- Old links keep working ----
// Links like /enovix/probability?v=B are already printed on handouts and
// saved by the concept check. Rather than chase every copy, the old URL
// forwards to the new one.
export function LessonRedirect() {
  const { id } = useParams();
  // One story per lesson now (the A/B pilot ended with B as the standard),
  // so any old ?v=A / ?v=B / ?v=C link simply opens the lesson.
  return <Navigate replace to={`/enovix/${id}/watch`} />;
}

// Which catalogue world a lesson belongs to.
const worldOf = (lessonId) => worlds.find((w) => w.lessons.some((l) => l.id === lessonId));

// Short name for a neighbouring lesson on the Back / Next buttons.
// Inside one course ("Part B") the part name is enough; across courses
// ("sin & cos C" before Statistics) we take the catalogue title up to the
// colon — the full title is a sentence and makes an unreadable button.
function shortName(fromLesson, id, lang) {
  const other = lessons[id];
  if (other?.part && other.breadcrumb === fromLesson.breadcrumb) return other.part;
  const cat = allLessons.find((l) => l.id === id);
  return t(cat?.title, 'en').split(':')[0] || t(other?.title, lang) || id;
}

// ---------------------------------------------------------------
// Quiz — one question per screen, feedback straight away.
// Answers lock once chosen: instant feedback is the teaching, and a
// score you can fix after seeing the ✗ would not mean anything.
// ---------------------------------------------------------------
function Quiz({ quiz, lang, saved, onSubmit }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState({});
  const [finished, setFinished] = useState(Boolean(saved));
  const ta = lang === 'ta';

  const answered = Object.keys(picked).map(Number);
  const right = new Set(answered.filter((k) => picked[k] === quiz[k].a));
  const wrong = new Set(answered.filter((k) => picked[k] !== quiz[k].a));

  if (finished) {
    // Coming back to a quiz already taken shows the saved score, not an
    // empty quiz: the step is done, and "Try again" is one tap away.
    const score = answered.length ? right.size : saved?.score ?? 0;
    const of = quiz.length;
    const strong = score / of >= 0.8;   // 4 out of 5
    return (
      <div className="card quiz-end">
        {strong && <Suspense fallback={null}><Trophy /></Suspense>}
        <p className="quiz-score">{score} / {of}</p>
        <p lang={lang}>
          {strong
            ? (ta ? 'அருமை! இந்த idea உங்களுக்கு நல்லா புரிஞ்சிருக்கு.' : 'Great! You have got this idea.')
            : (ta ? 'பரவாயில்லை. Story-ஐ இன்னொரு முறை பார்த்துட்டு மறுபடியும் try பண்ணுங்க.' : 'Not bad. Watch the story again, then have another go.')}
        </p>
        <button className="lp-ghost" onClick={() => { setPicked({}); setI(0); setFinished(false); }}>
          <MdReplay aria-hidden="true" /> {ta ? 'மறுபடியும் try பண்ண' : 'Try again'}
        </button>
      </div>
    );
  }

  const q = quiz[i];
  const mine = picked[i];
  const isLast = i === quiz.length - 1;
  const firstOpen = quiz.findIndex((_, k) => picked[k] === undefined);
  const finish = () => {
    // Every question answered: score it. Otherwise take the student to
    // the one they skipped instead of scoring a blank as wrong.
    if (firstOpen >= 0) { setI(firstOpen); return; }
    setFinished(true);
    onSubmit(right.size, quiz.length);
  };

  return (
    <div className="pager">
      <Dots count={quiz.length} at={i} done={right} wrong={wrong} onPick={setI} label="Question" />
      <div className={'card quiz-q ' + (mine === undefined ? '' : mine === q.a ? 'ok' : 'bad')}>
        <p lang={lang}><b>{i + 1}. {q.q[lang]}</b></p>
        <div className="quiz-opts">
          {q.o.map((o, j) => {
            const state = mine === undefined ? '' : j === q.a ? ' right' : j === mine ? ' wrong' : '';
            return (
              <button key={j} className={'quiz-opt' + state} disabled={mine !== undefined}
                onClick={() => setPicked({ ...picked, [i]: j })}>{o}</button>
            );
          })}
        </div>
        {mine !== undefined && <p className="quiz-fb" lang={lang}>{mine === q.a ? '✓ ' : '✗ '}{q.e[lang]}</p>}
      </div>
      <div className="pager-nav">
        <button className="lp-ghost pager-arrow" onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Previous question" title="Previous"><MdChevronLeft aria-hidden="true" /></button>
        {isLast || (mine !== undefined && answered.length === quiz.length)
          ? <button onClick={finish} disabled={mine === undefined}>{ta ? 'Score பார்க்க' : 'See my score'}</button>
          : <button className="pager-arrow" onClick={() => setI(i + 1)} disabled={mine === undefined} aria-label="Next question" title="Next"><MdChevronRight aria-hidden="true" /></button>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Missions — the bridge from concept to code.
// A lesson teaches the idea; its missions make the student use it. The
// pairing lives in the mission catalogue, so we read it from there: one
// source, and a mission that opens later appears here by itself.
// ---------------------------------------------------------------
function MissionCards({ lessonId, lang, prog }) {
  const ta = lang === 'ta';
  return (
    <div>
      <p className="muted" lang={lang}>
        {ta ? 'Idea-வை பார்த்தாச்சு. இந்த missions-ல நீங்களே எழுதணும் — ஒவ்வொன்னும் ஒரு function.'
            : 'You have seen the idea. These missions ask you to write it — one function each.'}
      </p>
      <div className="mcards">
        {missionsOf(lessonId).map((m) => {
          const p = products[m.product];
          const built = prog?.[m.id]?.stages?.write;
          const inner = (
            <>
              <span className="mcard-product">{p.emoji} {p.name}</span>
              <b lang={lang}>{t(m.title, lang)}</b>
              <span className={'mcard-cta' + (built ? ' built' : '')}>
                {m.status !== 'live' ? 'Coming soon' : built ? <><MdCheck aria-hidden="true" /> Built</> : 'Start mission →'}
              </span>
            </>
          );
          return m.status === 'live'
            ? <Link key={m.id} to={`/missions/${m.id}`} className="card mcard">{inner}</Link>
            : <div key={m.id} className="card mcard soon" aria-disabled="true">{inner}</div>;
        })}
      </div>
    </div>
  );
}

export default function LessonShell() {
  const { id, step } = useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useLang();
  const [progress, update] = useLessonProgress(id);
  const [missionProg, setMissionProg] = useState(null);
  const lesson = lessons[id];

  // Mission progress decides only whether the Missions step shows ✓.
  // A sleeping server must never block the lesson, so failures are silent.
  useEffect(() => {
    let cancelled = false;
    api.get('/missions/progress').then((r) => { if (!cancelled) setMissionProg(r.data.missions); }).catch(() => {});
    return () => { cancelled = true; };
  }, [id]);

  // Focus mode: the app's bottom tab bar steps aside (see MobileNav) and
  // the lesson's own Back / Next bar takes its place.
  useEffect(() => {
    document.body.classList.add('focus-mode');
    return () => document.body.classList.remove('focus-mode');
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [id, step]);

  // Tab title: "Statistics · Quiz · Enovix" — short catalogue name, then the step.
  useEffect(() => {
    if (!lesson) return;
    const name = t(allLessons.find((l) => l.id === id)?.title, 'en').split(':')[0] || id;
    document.title = `${name} · ${STEPS[step]?.label ?? 'Lesson'} · Enovix`;
  }, [id, step, lesson]);

  if (!lesson) return <p>Lesson not found. <Link to="/enovix">Back to Enovix</Link></p>;

  const steps = stepsFor(lesson);
  if (!steps.includes(step)) return <Navigate replace to={`/enovix/${id}/${steps[0]}`} />;
  // First visit: the other steps open after the story has been watched once.
  // A typed or shared URL to /lab must not get round that.
  if (stepLocked(step, progress)) return <Navigate replace to={`/enovix/${id}/watch`} />;

  // One story per lesson: 'main', or 'B' for probability (see lessons/index.js).
  const v = lesson.defaultVersion;
  const story = lesson.narration.versions[v];
  const href = (st) => `/enovix/${id}/${st}`;

  const done = doneSteps(lesson, progress, missionProg);
  const counts = stepCounts(lesson, progress);
  const idx = steps.indexOf(step);
  const prevStep = steps[idx - 1];
  const nextStep = steps[idx + 1];
  const ta = lang === 'ta';

  const addOnce = (key, value) => update((p) => (p[key].includes(value) ? {} : { [key]: [...p[key], value] }));

  return (
    <div className="shell lesson">
      {/* ---- top bar ---- */}
      <div className="shell-top">
        <Link to="/enovix" className="shell-back" aria-label="Back to Enovix" title="Back to Enovix"><MdArrowBack aria-hidden="true" /></Link>
        <div className="shell-title">
          <p className="muted">{lesson.breadcrumb}</p>
          <h2 lang={lang}>{t(lesson.title, lang)}</h2>
        </div>
        <button className="shell-lang" onClick={() => setLang(ta ? 'en' : 'ta')}
          aria-label={ta ? 'Switch to English' : 'Switch to Tamil'} title={ta ? 'Switch to English' : 'Switch to Tamil'}>
          <MdTranslate aria-hidden="true" /> <span lang={lang}>{ta ? 'தமிழ்' : 'English'}</span>
        </button>
      </div>

      {/* ---- stepper ---- */}
      <nav className="stepper" aria-label="Lesson steps">
        <ol>
          {steps.map((s, k) => {
            const { label, Icon } = STEPS[s];
            const locked = stepLocked(s, progress);
            // Numbers, not words: "3/9" says how far along a step is at a
            // glance. A ✓ replaces it only when the step is really done.
            const n = counts[s];
            const badge = done.has(s)
              ? <span className="stepper-tick"><MdCheck aria-hidden="true" /></span>
              : locked
                ? <span className="stepper-tick locked"><MdLock aria-hidden="true" /></span>
                : n && n[0] > 0 ? <span className="stepper-count">{n[0]}/{n[1]}</span> : null;
            const name = `Step ${k + 1}: ${label}${done.has(s) ? ' (done)' : locked ? ' (watch the lesson first)' : n ? ` (${n[0]} of ${n[1]})` : ''}`;
            const inner = (
              <>
                <span className="stepper-icon"><Icon aria-hidden="true" />{badge}</span>
                <span className="stepper-label">{label}</span>
              </>
            );
            return (
              <li key={s} className={(s === step ? 'on ' : '') + (done.has(s) ? 'done ' : '') + (locked ? 'locked' : '')}>
                {locked
                  ? <span className="stepper-locked" aria-disabled="true" aria-label={name} title={name}>{inner}</span>
                  : <Link to={href(s)} aria-current={s === step ? 'step' : undefined} aria-label={name} title={label}>{inner}</Link>}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ---- the step itself ---- */}
      <section className="shell-body">
        {step === 'watch' && (
          <>
            <LessonPlayer key={`${id}-${v}`} lessonId={lesson.id} version={v} story={story} createScenes={lesson.scenes[v]}
              lang={lang} onLangChange={setLang}
              // Resume: start from the scene they left, and remember each new
              // one. Finishing clears it, so a replay starts at the beginning.
              resumeScene={progress.resume || 0}
              onScene={(sc) => update({ resume: sc })}
              onComplete={() => update({ watched: true, resume: 0 })}
              onNext={nextStep ? () => navigate(href(nextStep)) : undefined}
              nextLabel={nextStep ? STEPS[nextStep].next : ''} />
          </>
        )}

        {step === 'practice' && (
          <>
            <p className="muted" lang={lang}>
              {ta ? 'Paper-and-pen கணக்குகள்: exam-லயும் aptitude round-லயும் வர்ற மாதிரி.'
                  : 'Paper-and-pen problems, the kind that turn up in exams and aptitude rounds.'}
            </p>
            <Practice problems={lesson.practice} lang={lang} solved={progress.practiceSolved}
              onSolve={(k) => addOnce('practiceSolved', k)} />
          </>
        )}

        {step === 'lab' && (
          <CodeLab createLab={lesson.createLab} lang={lang} ran={progress.labRuns}
            onRun={(expId) => addOnce('labRuns', expId)} />
        )}

        {step === 'quiz' && (
          <Quiz quiz={lesson.quiz} lang={lang} saved={progress.quiz}
            onSubmit={(score, of) => update({ quiz: { score, of } })} />
        )}

        {step === 'missions' && <MissionCards lessonId={lesson.id} lang={lang} prog={missionProg} />}
      </section>

      {/* ---- End of a world ----
          The last lesson of a world has no `next` (the next world is not
          built yet), so instead of a dead end we say where the student
          stands: complete, or what is left to complete it. */}
      {!nextStep && !lesson.next && worldOf(lesson.id) && (
        <p className="shell-finale" lang={lang}>
          {worldComplete(worldOf(lesson.id).id, missionProg)
            ? `🏆 World ${worldOf(lesson.id).id} complete`
            : ta
              ? `🏁 World ${worldOf(lesson.id).id}-ஓட கடைசி lesson இது. எல்லா quiz-உம், ஒவ்வொரு lesson-லயும் ஒரு mission-உம் முடிச்சா World complete!`
              : `🏁 This is the last lesson of World ${worldOf(lesson.id).id}. Finish every quiz and one mission per lesson to complete it.`}
        </p>
      )}

      {/* ---- bottom nav: always within thumb reach ---- */}
      <div className="shell-nav">
        {prevStep
          ? <Link className="lp-ghost shell-btn" to={href(prevStep)}>← Back</Link>
          : lesson.prev
            ? <Link className="lp-ghost shell-btn" to={`/enovix/${lesson.prev}`}>← {shortName(lesson, lesson.prev, lang)}</Link>
            : <Link className="lp-ghost shell-btn" to="/enovix">← Enovix</Link>}
        {nextStep && stepLocked(nextStep, progress)
          ? <span className="shell-btn primary disabled" aria-disabled="true" lang={lang}>
              <MdLock aria-hidden="true" /> {ta ? 'முதல்ல lesson-ஐ பாருங்க' : 'Watch to unlock'}
            </span>
          : nextStep
          ? <Link className="shell-btn primary" to={href(nextStep)}>Next: {STEPS[nextStep].next} →</Link>
          : lesson.next
            ? <Link className="shell-btn primary" to={`/enovix/${lesson.next}`} title={shortName(lesson, lesson.next, lang)}>Next lesson →</Link>
            : <Link className="shell-btn primary" to="/enovix">Back to Enovix</Link>}
      </div>
    </div>
  );
}
