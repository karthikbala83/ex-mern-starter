// Lesson registry. Add a folder per lesson and register it here.
//
// `defaultVersion` is what the player uses when the URL has no ?v=.
// Probability is the odd one out: it was built for the A/B pilot and has
// three story versions, so it keeps 'B'. Every lesson since has a single
// story under the key 'main' — there is nothing to compare, so there is
// nothing to choose.
//
// `prev` / `next` chain the three sin & cos parts into one course. Keeping
// the order here rather than inside each lesson means re-ordering the
// course is one edit in one file.
//
// `part` is the SHORT name used on those buttons. The real titles are a
// full sentence in two languages ("sin & cos B: பூமியில, ஒவ்வொரு map-லயும்"),
// which makes an unreadable button — a reader going next wants "Part B →",
// not the whole title again.
import probNarration from './probability/narration.json';
import probScenesA from './probability/scenesA.js';
import probScenesB from './probability/scenesB.js';
import probLab from './probability/lab.js';
import probQuiz from './probability/quiz.js';

import aNarration from './sincos-a/narration.json';
import aScenes from './sincos-a/scenes.js';
import aLab from './sincos-a/lab.js';
import aQuiz from './sincos-a/quiz.js';
import aPractice from './sincos-a/practice.js';

import bNarration from './sincos-b/narration.json';
import bScenes from './sincos-b/scenes.js';
import bLab from './sincos-b/lab.js';
import bQuiz from './sincos-b/quiz.js';
import bPractice from './sincos-b/practice.js';

import cNarration from './sincos-c/narration.json';
import cScenes from './sincos-c/scenes.js';
import cLab from './sincos-c/lab.js';
import cQuiz from './sincos-c/quiz.js';
import cPractice from './sincos-c/practice.js';

const TRIG = 'CSE › Mathematics for Computing › Trigonometry';

export const lessons = {
  probability: {
    id: 'probability',
    title: probNarration.title,
    breadcrumb: 'CSE › Mathematics for Computing › Probability',
    narration: probNarration,
    scenes: { A: probScenesA, B: probScenesB },
    defaultVersion: 'B',
    createLab: probLab,
    quiz: probQuiz,
  },
  'sincos-a': {
    id: 'sincos-a',
    part: 'Part A',
    title: aNarration.title,
    breadcrumb: TRIG,
    narration: aNarration,
    scenes: { main: aScenes },
    defaultVersion: 'main',
    createLab: aLab,
    practice: aPractice,
    quiz: aQuiz,
    next: 'sincos-b',
  },
  'sincos-b': {
    id: 'sincos-b',
    part: 'Part B',
    title: bNarration.title,
    breadcrumb: TRIG,
    narration: bNarration,
    scenes: { main: bScenes },
    defaultVersion: 'main',
    createLab: bLab,
    practice: bPractice,
    quiz: bQuiz,
    prev: 'sincos-a',
    next: 'sincos-c',
  },
  'sincos-c': {
    id: 'sincos-c',
    part: 'Part C',
    title: cNarration.title,
    breadcrumb: TRIG,
    narration: cNarration,
    scenes: { main: cScenes },
    defaultVersion: 'main',
    createLab: cLab,
    practice: cPractice,
    quiz: cQuiz,
    prev: 'sincos-b',
  },
};
