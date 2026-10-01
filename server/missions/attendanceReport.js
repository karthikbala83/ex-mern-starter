// World 1 · Statistics · 🏢 CampusOps: the HoD's attendance report.
// The rule is "at least 75%": exactly 75 is eligible, so it is NOT counted as below.
const { rng, close } = require('./_shared');

function reference(percentages) {
  const mean = percentages.reduce((s, x) => s + x, 0) / percentages.length;
  const s = [...percentages].sort((a, b) => a - b);
  const n = s.length;
  const median = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  const below75 = percentages.filter((p) => p < 75).length;
  return { mean, median, below75 };
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[[80, 70, 90, 74, 75]], [[75, 75, 75]], [[100, 12, 88]]];
  for (let i = 0; i < 7; i++) {
    const n = 8 + Math.floor(R() * 23);                   // 8..30 students
    const arr = Array.from({ length: n }, () => Math.round(55 + R() * 45));
    arr[Math.floor(R() * n)] = 75;                        // always include the edge case
    cases.push([arr]);
  }
  return cases;
}

module.exports = {
  id: 'attendanceReport', fnName: 'attendanceReport', predictAnswer: 1,
  bonusMustUse: 'math.',   // bonus stage: code must actually use mathjs
  points: { predict: 10, fill: 20, write: 50, bonus: 20, hint: -5, firstTry: 10 },
  reference, generateInputs, compare: (e, a) => close(e, a, 1e-9),
  hints: [
    { en: 'Three numbers to return: mean, median, and how many students are below 75.', ta: 'மூணு numbers return பண்ணணும்: mean, median, 75-க்கு கீழ எத்தனை students.' },
    { en: 'The rule is "at least 75%". Is a student with exactly 75 below? Use < not <=.', ta: 'Rule "குறைஞ்சது 75%". சரியா 75 எடுத்த student கீழயா? <= இல்ல, < use பண்ணுங்க.' },
    { en: 'const below75 = percentages.filter((p) => p < 75).length;', ta: 'const below75 = percentages.filter((p) => p < 75).length;' },
  ],
};
