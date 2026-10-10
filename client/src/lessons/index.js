// Lesson registry. Add a folder per lesson and register it here.
//
// `defaultVersion` is the story the player uses. Probability was built for
// an A/B pilot; the pilot is over and Version B is the standard, so only B
// is registered (scenesA.js and its narration stay in the folder as a
// record, unused). Every lesson since has a single story under 'main'.
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

import sNarration from './statistics/narration.json';
import sScenes from './statistics/scenes.js';
import sLab from './statistics/lab.js';
import sQuiz from './statistics/quiz.js';
import sPractice from './statistics/practice.js';

import pNarration from './polynomials/narration.json';
import pScenes from './polynomials/scenes.js';
import pLab from './polynomials/lab.js';
import pQuiz from './polynomials/quiz.js';
import pPractice from './polynomials/practice.js';

import gNarration from './gradient/narration.json';
import gScenes from './gradient/scenes.js';
import gLab from './gradient/lab.js';
import gQuiz from './gradient/quiz.js';
import gPractice from './gradient/practice.js';

import fNarration from './fourier/narration.json';
import fScenes from './fourier/scenes.js';
import fLab from './fourier/lab.js';
import fQuiz from './fourier/quiz.js';
import fPractice from './fourier/practice.js';

import vNarration from './vectors/narration.json';
import vScenes from './vectors/scenes.js';
import vLab from './vectors/lab.js';
import vQuiz from './vectors/quiz.js';
import vPractice from './vectors/practice.js';

const TRIG = 'CSE › Mathematics for Computing › Trigonometry';

export const lessons = {
  probability: {
    id: 'probability',
    title: probNarration.title,
    breadcrumb: 'CSE › Mathematics for Computing › Probability',
    narration: probNarration,
    scenes: { B: probScenesB },
    defaultVersion: 'B',
    createLab: probLab,
    quiz: probQuiz,
    // First lesson of the course. Without `next` it looked like a dead end
    // and showed the "last lesson of World 1" note.
    next: 'sincos-a',
  },
  'sincos-a': {
    id: 'sincos-a',
    prev: 'probability',
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
    next: 'statistics',
  },
  statistics: {
    id: 'statistics',
    title: sNarration.title,
    breadcrumb: 'CSE › Mathematics for Computing › Statistics',
    narration: sNarration,
    scenes: { main: sScenes },
    defaultVersion: 'main',
    createLab: sLab,
    practice: sPractice,
    quiz: sQuiz,
    prev: 'sincos-c',
    next: 'polynomials',
  },
  polynomials: {
    id: 'polynomials',
    title: pNarration.title,
    breadcrumb: 'CSE › Mathematics for Computing › Polynomials',
    narration: pNarration,
    scenes: { main: pScenes },
    defaultVersion: 'main',
    createLab: pLab,
    practice: pPractice,
    quiz: pQuiz,
    prev: 'statistics',
    next: 'gradient',
  },
  gradient: {
    id: 'gradient',
    title: gNarration.title,
    breadcrumb: 'CSE › Mathematics for Computing › Gradient descent',
    narration: gNarration,
    scenes: { main: gScenes },
    defaultVersion: 'main',
    createLab: gLab,
    practice: gPractice,
    quiz: gQuiz,
    prev: 'polynomials',
    next: 'fourier',
  },
  fourier: {
    id: 'fourier',
    title: fNarration.title,
    breadcrumb: 'CSE › Mathematics for Computing › Fourier',
    narration: fNarration,
    scenes: { main: fScenes },
    defaultVersion: 'main',
    createLab: fLab,
    practice: fPractice,
    quiz: fQuiz,
    prev: 'gradient',
    next: 'vectors',
  },
  // The last World 1 lesson. No `next` until World 2 exists: the shell
  // then ends the lesson with "World 1 complete" and "Back to Enovix".
  vectors: {
    id: 'vectors',
    title: vNarration.title,
    breadcrumb: 'CSE › Mathematics for Computing › Vectors & matrices',
    narration: vNarration,
    scenes: { main: vScenes },
    defaultVersion: 'main',
    createLab: vLab,
    practice: vPractice,
    quiz: vQuiz,
    prev: 'fourier',
  },
};
