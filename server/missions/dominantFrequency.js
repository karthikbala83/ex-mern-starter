// World 1 · Fourier · 🏢 CampusOps: the lab machine-health check.
// waveStrength is PRE-BUILT for students (same code in their starter); they write the search.
const { rng, round } = require('./_shared');
const { reference: waveStrength } = require('./waveStrength');

// The whole-number frequency from 1 to maxFreq with the largest strength. Ties go to the lower one.
function reference(signal, rate, maxFreq) {
  let bestFreq = 1, bestStrength = -1;
  for (let f = 1; f <= maxFreq; f++) {
    const s = waveStrength(signal, f, rate);
    if (s > bestStrength) { bestStrength = s; bestFreq = f; }
  }
  return bestFreq;
}

function generateInputs(seed) {
  const R = rng(seed);
  const make = (rate, parts, noise) => Array.from({ length: rate }, (_, n) => round(parts.reduce((s, [f, a, ph]) => s + a * Math.sin(2 * Math.PI * f * n / rate + ph), 0) + noise * (R() - 0.5), 6));
  const cases = [[make(200, [[25, 1, 0], [70, 0.3, 1]], 0.2), 200, 99]];
  for (let i = 0; i < 6; i++) {
    const rate = [200, 256, 300][i % 3], maxF = Math.floor(rate / 2) - 1;
    const main = 2 + Math.floor(R() * (maxF - 3));
    const parts = [[main, 1, round(R() * 6.28, 2)], [2 + Math.floor(R() * (maxF - 3)), round(0.2 + R() * 0.4, 2), round(R() * 6.28, 2)]];
    if (parts[1][0] === main) parts[1][0] = main === 2 ? 3 : main - 1;
    cases.push([make(rate, parts, 0.3), rate, maxF]);
  }
  return cases;
}

module.exports = {
  id: 'dominantFrequency', fnName: 'dominantFrequency', predictAnswer: 2,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference, generateInputs, compare: (e, a) => e === a,
  hints: [
    { en: 'Try every whole frequency from 1 to maxFreq. waveStrength(signal, f, rate) tells you how strong each one is.', ta: '1-ல இருந்து maxFreq வரை ஒவ்வொரு முழு frequency-ஐயும் try பண்ணுங்க. waveStrength(signal, f, rate) ஒவ்வொண்ணும் எவ்வளவு strong-ன்னு சொல்லும்.' },
    { en: 'Keep the best so far: if this strength is bigger than the best, remember this frequency.', ta: 'இதுவரை best-ஐ வெச்சுக்கோங்க: இந்த strength best-ஐ விட பெருசா இருந்தா, இந்த frequency-ஐ ஞாபகம் வெச்சுக்கோங்க.' },
    { en: 'let bestFreq = 1, bestStrength = -1;\nfor (let f = 1; f <= maxFreq; f++) {\n  const s = waveStrength(signal, f, rate);\n  if (s > bestStrength) { bestStrength = s; bestFreq = f; }\n}\nreturn bestFreq;', ta: 'let bestFreq = 1, bestStrength = -1;\nfor (let f = 1; f <= maxFreq; f++) {\n  const s = waveStrength(signal, f, rate);\n  if (s > bestStrength) { bestStrength = s; bestFreq = f; }\n}\nreturn bestFreq;' },
  ],
};
