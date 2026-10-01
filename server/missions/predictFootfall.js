// World 1 · Polynomials · 🏢 CampusOps: forecast tomorrow's fest footfall.
// fitQuadratic is PRE-BUILT for students (same code in their starter); they write the prediction.
const { rng } = require('./_shared');

// Least-squares fit of a + b·d + c·d² to history (days 1..n), solved with Gaussian elimination.
function fitQuadratic(history) {
  const S = (p) => history.reduce((s, _, i) => s + (i + 1) ** p, 0);
  const T = (p) => history.reduce((s, y, i) => s + y * (i + 1) ** p, 0);
  const A = [[S(0), S(1), S(2)], [S(1), S(2), S(3)], [S(2), S(3), S(4)]], B = [T(0), T(1), T(2)];
  for (let c = 0; c < 3; c++) for (let r = c + 1; r < 3; r++) {
    const f = A[r][c] / A[c][c];
    for (let k = c; k < 3; k++) A[r][k] -= f * A[c][k];
    B[r] -= f * B[c];
  }
  const x = [0, 0, 0];
  for (let r = 2; r >= 0; r--) { let s = B[r]; for (let k = r + 1; k < 3; k++) s -= A[r][k] * x[k]; x[r] = s / A[r][r]; }
  return { a: x[0], b: x[1], c: x[2] };
}

function reference(history, day) {
  const { a, b, c } = fitQuadratic(history);
  return Math.max(0, Math.round(a + b * day + c * day * day));   // whole people, never negative
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[[300, 440, 610, 905, 1215], 6], [[500, 350, 220, 120, 40], 8]];   // second: falls below zero → 0
  for (let i = 0; i < 8; i++) {
    const n = 5 + Math.floor(R() * 6), a = 100 + R() * 300, b = 10 + R() * 60, c = R() * 40 - (i % 4 === 0 ? 30 : 0);
    const h = Array.from({ length: n }, (_, k) => Math.max(0, Math.round(a + b * (k + 1) + c * (k + 1) ** 2 + (R() - 0.5) * 60)));
    cases.push([h, n + 1 + Math.floor(R() * 2)]);
  }
  return cases;
}

module.exports = {
  id: 'predictFootfall', fnName: 'predictFootfall', predictAnswer: 0,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference, generateInputs, fitQuadratic,
  // Within 1 person: rounding at exactly .5 can differ by tiny floating-point amounts.
  compare: (e, a) => typeof a === 'number' && Math.abs(e - a) <= 1,
  hints: [
    { en: 'fitQuadratic(history) already gives you a, b and c. Your job: plug in the day.', ta: 'fitQuadratic(history) ஏற்கனவே a, b, c தருது. உங்க வேலை: day-ஐ போடுறது.' },
    { en: 'people = a + b·day + c·day². Then round to whole people and never return a negative number.', ta: 'people = a + b·day + c·day². அப்புறம் முழு ஆட்களா round பண்ணி, negative number return பண்ணவே கூடாது.' },
    { en: 'const { a, b, c } = fitQuadratic(history);\nreturn Math.max(0, Math.round(a + b * day + c * day * day));', ta: 'const { a, b, c } = fitQuadratic(history);\nreturn Math.max(0, Math.round(a + b * day + c * day * day));' },
  ],
};
