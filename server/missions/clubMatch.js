// World 1 · Vectors & matrices · 🏢 CampusOps: recommend clubs to students.
const { rng, close } = require('./_shared');

// cos of the angle between two interest vectors. 0 if either has no interests at all.
function reference(a, b) {
  const dot = a.reduce((s, x, i) => s + x * b[i], 0);
  const lenA = Math.hypot(...a), lenB = Math.hypot(...b);
  if (lenA === 0 || lenB === 0) return 0;          // avoid dividing by zero
  return dot / (lenA * lenB);
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[[5, 1, 0, 4], [4, 0, 1, 5]], [[1, 0], [0, 1]], [[2, 2], [4, 4]], [[0, 0, 0, 0], [1, 2, 3, 4]]];
  for (let i = 0; i < 6; i++) { const n = 3 + Math.floor(R() * 5); cases.push([Array.from({ length: n }, () => Math.floor(R() * 6)), Array.from({ length: n }, () => Math.floor(R() * 6))]); }
  return cases;
}

module.exports = {
  id: 'clubMatch', fnName: 'cosineSimilarity', predictAnswer: 1,
  points: { predict: 10, fill: 20, write: 50, bonus: 20, hint: -5, firstTry: 10 },
  bonusMustUse: 'math.',
  reference, generateInputs, compare: (e, a) => close(e, a, 1e-9),
  hints: [
    { en: 'Dot product: multiply matching numbers and add them all up.', ta: 'Dot product: ஒத்த numbers-ஐ பெருக்கி, எல்லாத்தையும் கூட்டுங்க.' },
    { en: 'Divide by (length of a × length of b). If either length is 0, return 0.', ta: '(a-ஓட நீளம் × b-ஓட நீளம்)-ஆல வகுங்க. ஏதாவது ஒரு நீளம் 0-ன்னா, 0 return பண்ணுங்க.' },
    { en: 'const dot = a.reduce((s, x, i) => s + x * b[i], 0);\nconst lenA = Math.hypot(...a), lenB = Math.hypot(...b);\nif (lenA === 0 || lenB === 0) return 0;\nreturn dot / (lenA * lenB);', ta: 'const dot = a.reduce((s, x, i) => s + x * b[i], 0);\nconst lenA = Math.hypot(...a), lenB = Math.hypot(...b);\nif (lenA === 0 || lenB === 0) return 0;\nreturn dot / (lenA * lenB);' },
  ],
};
