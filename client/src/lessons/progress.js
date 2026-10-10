// ---------------------------------------------------------------
// Lesson progress + language preference, kept in localStorage.
//
// Why localStorage and not the server (yet): progress here is a nudge
// ("you have done 3 of 5 steps"), not a grade. Nothing is lost if a
// student clears their browser, so it does not need a collection, an
// endpoint and a deploy. Server sync comes later — and when it does, only
// this file changes; every page reads progress through these functions.
//
// Every read is wrapped in try/catch: private windows and some school
// browsers throw on localStorage access, and a broken preference must
// never break a lesson.
// ---------------------------------------------------------------
import { useCallback, useEffect, useState } from 'react';
import { allLessons, worlds } from '../missions/catalog.js';

const LANG_KEY = 'enovix.lang';

// ---- Progress belongs to a STUDENT, not to a browser ----
// College lab PCs and shared phones are normal here. A key without the
// user id would show the next student the last one's ✓ marks, quiz scores
// and even "World 1 complete". The id comes from the login AuthContext
// saved; 'anon' only happens on a page nobody logged in to.
const currentUserId = () => {
  try { return JSON.parse(localStorage.getItem('user'))?.id || 'anon'; } catch { return 'anon'; }
};
const progressKey = (lessonId) => `enovix.progress.${currentUserId()}.${lessonId}`;

function readJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

// Progress saved before it was per-student used `enovix.progress.<lesson>`.
// The first student to open that lesson on this browser adopts it (most
// likely its owner — beta testers on their own phones), then it is deleted
// so nobody else can pick it up.
function adoptLegacy(lessonId) {
  try {
    const old = `enovix.progress.${lessonId}`;
    const raw = localStorage.getItem(old);
    if (raw && !localStorage.getItem(progressKey(lessonId))) localStorage.setItem(progressKey(lessonId), raw);
    if (raw) localStorage.removeItem(old);
  } catch { /* storage blocked */ }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked: progress just won't persist */ }
}

// ---- Language: ONE choice for every step of every lesson ----
// A student who picked English on the Watch step should not land on
// Tamil in the quiz. The 'storage' event keeps two open tabs in step.
export function useLang() {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ta'; } catch { return 'ta'; }
  });
  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    const onStorage = (e) => { if (e.key === LANG_KEY && e.newValue) setLangState(e.newValue === 'en' ? 'en' : 'ta'); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return [lang, setLang];
}

// ---- Per-lesson progress ----
// Shape: { watched, practiceSolved: [], labRuns: [], quiz: { score, of }, at }
// resume: the scene the student was on when they left the Watch step, so
// the player can offer "continue from scene 4" instead of starting over.
const EMPTY = { watched: false, practiceSolved: [], labRuns: [], quiz: null, resume: 0, at: null };

export function readProgress(lessonId) {
  adoptLegacy(lessonId);
  return { ...EMPTY, ...readJSON(progressKey(lessonId), {}) };
}

export function useLessonProgress(lessonId) {
  const [progress, setProgress] = useState(() => readProgress(lessonId));
  useEffect(() => { setProgress(readProgress(lessonId)); }, [lessonId]);

  // Merge-and-save. Takes a function so callers can add to an array
  // ("one more solved problem") without reading stale state.
  const update = useCallback((patch) => {
    setProgress((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch), at: new Date().toISOString() };
      writeJSON(progressKey(lessonId), next);
      return next;
    });
  }, [lessonId]);

  return [progress, update];
}

// ---- Steps ----
// The order is the teaching order: see it, try it by hand, try it in code,
// check yourself, then build with it. A lesson that lacks a step (the
// probability pilot has no practice set) simply skips it.
export const STEP_ORDER = ['watch', 'practice', 'lab', 'quiz', 'missions'];

export function missionsOf(lessonId) {
  return allLessons.find((l) => l.id === lessonId)?.missions ?? [];
}

export function stepsFor(lesson) {
  const has = {
    watch: Boolean(lesson.narration),
    practice: Boolean(lesson.practice?.length),
    lab: Boolean(lesson.createLab),
    quiz: Boolean(lesson.quiz?.length),
    missions: missionsOf(lesson.id).length > 0,
  };
  return STEP_ORDER.filter((s) => has[s]);
}

// Which steps count as done. `missionProgress` is the `missions` map from
// GET /api/missions/progress (may be null when the server is asleep — then
// the Missions step simply shows as not done yet).
// How many lab experiments a lesson has. createLab(null) builds the list
// without drawing anything; cached because the stepper asks on every render.
const labCount = new WeakMap();
const experimentsIn = (lesson) => {
  if (!lesson.createLab) return 0;
  if (!labCount.has(lesson.createLab)) labCount.set(lesson.createLab, lesson.createLab(null).labs.length);
  return labCount.get(lesson.createLab);
};

// "3 / 9" style counts for the steps that have several items. The stepper
// shows these numbers instead of words, and a ✓ only once the step is done.
export function stepCounts(lesson, progress) {
  return {
    practice: lesson.practice?.length ? [progress.practiceSolved.length, lesson.practice.length] : null,
    lab: lesson.createLab ? [new Set(progress.labRuns).size, experimentsIn(lesson)] : null,
  };
}

// First visit: watch the lesson before anything else opens — the code lab
// and quiz assume you have seen the story. Once watched, every step stays
// open on every later visit, so a returning student can jump straight in.
export const stepLocked = (step, progress) => step !== 'watch' && !progress.watched;

export function doneSteps(lesson, progress, missionProgress) {
  const done = new Set();
  if (progress.watched) done.add('watch');
  // 60%, not 100%: practice is for confidence, and a student stuck on one
  // hard problem should still see the step as achieved.
  if (lesson.practice?.length && progress.practiceSolved.length >= Math.ceil(lesson.practice.length * 0.6)) done.add('practice');
  // The code lab is done when EVERY experiment has been run once: each one
  // shows a different idea, so "1 of 5" is a start, not a finish.
  const labs = experimentsIn(lesson);
  if (labs && new Set(progress.labRuns).size >= labs) done.add('lab');
  if (progress.quiz) done.add('quiz');
  // A mission counts once its "write it" stage passed — that is the
  // server-graded proof the student can use the idea, not just watch it.
  if (missionsOf(lesson.id).some((m) => missionProgress?.[m.id]?.stages?.write)) done.add('missions');
  return done;
}

// ---- World completion ----
// A world is complete when, for EVERY lesson in it:
//   - the Quiz step is done (local progress), and
//   - at least one of the lesson's missions has its "write" stage passed
//     (server-graded, from GET /api/missions/progress).
// Quiz alone would let a student click through; a mission alone would
// skip the concept. Together they mean "understood it AND used it".
//
// A world with a lesson that is not live yet can never be complete: you
// cannot finish what has not been built. One rule, one place, so World 2
// reuses it by passing 2.
export function worldComplete(worldId, missionProgress) {
  const world = worlds.find((w) => w.id === worldId);
  if (!world || !missionProgress) return false;   // server asleep: say nothing rather than guess
  return world.lessons.every((l) => {
    if (l.status !== 'live') return false;
    const quizDone = Boolean(readProgress(l.id).quiz);
    const built = l.missions.length === 0 || l.missions.some((m) => missionProgress[m.id]?.stages?.write);
    return quizDone && built;
  });
}

// "One-time" celebration: once dismissed on either page, it stays dismissed.
// Per student, like progress: one student closing the card must not hide it from the next.
const seenKey = (worldId) => `enovix.world${worldId}.celebrated.${currentUserId()}`;
export const worldCelebrated = (worldId) => readJSON(seenKey(worldId), false);
export const markWorldCelebrated = (worldId) => writeJSON(seenKey(worldId), true);
