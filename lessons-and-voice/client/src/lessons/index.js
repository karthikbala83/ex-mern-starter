// Lesson registry. Add a folder per lesson and register it here.
import probNarration from './probability/narration.json';
import probScenesA from './probability/scenesA.js';
import probScenesB from './probability/scenesB.js';
import probLab from './probability/lab.js';
import probQuiz from './probability/quiz.js';

export const lessons = {
  probability: {
    id: 'probability',
    title: probNarration.title,
    breadcrumb: 'CSE › Mathematics for Computing › Probability',
    narration: probNarration,
    scenes: { A: probScenesA, B: probScenesB },
    createLab: probLab,
    quiz: probQuiz,
  },
};
