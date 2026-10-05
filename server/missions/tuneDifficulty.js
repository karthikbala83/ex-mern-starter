// World 1 · Gradient descent · 🎮 Campus Quest: a game that adapts to you.
// The same idea as gradient descent: measure the error (win rate − target), step to shrink it.
const { rng, round, close } = require('./_shared');

function reference(difficulty, winRate, target, rate) {
  const next = difficulty + rate * (winRate - target);     // winning too often → harder
  return Math.min(10, Math.max(1, next));                  // difficulty stays between 1 and 10
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[5, 0.8, 0.5, 4], [5, 0.2, 0.5, 4], [5, 0.5, 0.5, 4], [9.8, 1, 0.5, 4], [1.2, 0, 0.5, 4]];   // last two test the clamps
  for (let i = 0; i < 6; i++) cases.push([round(1 + R() * 9, 2), round(R(), 2), round(0.3 + R() * 0.4, 2), round(1 + R() * 6, 2)]);
  return cases;
}

module.exports = {
  id: 'tuneDifficulty', fnName: 'tuneDifficulty', predictAnswer: 0,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference, generateInputs, compare: (e, a) => close(e, a, 1e-9),
  hints: [
    { en: 'The error is winRate − target. Positive means players win too often, so difficulty should go UP.', ta: 'Error = winRate − target. Positive-ன்னா players ரொம்ப அடிக்கடி ஜெயிக்கிறாங்க, அதனால difficulty மேல போகணும்.' },
    { en: 'new difficulty = difficulty + rate × (winRate − target). Then keep it between 1 and 10.', ta: 'புது difficulty = difficulty + rate × (winRate − target). அப்புறம் அதை 1-க்கும் 10-க்கும் நடுவுல வெச்சுக்கோங்க.' },
    { en: 'const next = difficulty + rate * (winRate - target);\nreturn Math.min(10, Math.max(1, next));', ta: 'const next = difficulty + rate * (winRate - target);\nreturn Math.min(10, Math.max(1, next));' },
  ],
};
