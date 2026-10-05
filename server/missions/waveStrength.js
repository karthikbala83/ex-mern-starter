// World 1 · Fourier · 🎮 Campus Quest: the fest stage's music visualiser.
const { rng, round, close } = require('./_shared');

// How strong is one frequency inside a signal? Match with sin AND cos, combine with Pythagoras.
function reference(signal, freq, rate) {
  let re = 0, im = 0;
  for (let n = 0; n < signal.length; n++) {
    const angle = 2 * Math.PI * freq * n / rate;
    re += signal[n] * Math.cos(angle);
    im += signal[n] * Math.sin(angle);
  }
  return (2 / signal.length) * Math.hypot(re, im);
}

function generateInputs(seed) {
  const R = rng(seed);
  const make = (rate, parts) => Array.from({ length: rate }, (_, n) => round(parts.reduce((s, [f, a, ph]) => s + a * Math.sin(2 * Math.PI * f * n / rate + ph), 0), 6));
  const cases = [[make(200, [[10, 1, 0]]), 10, 200], [make(200, [[10, 1, 0]]), 30, 200], [make(200, [[10, 1, Math.PI / 2]]), 10, 200]];   // the last one is a cos wave
  for (let i = 0; i < 7; i++) {
    const rate = [200, 256, 400][i % 3];
    const parts = Array.from({ length: 1 + Math.floor(R() * 3) }, () => [1 + Math.floor(R() * (rate / 2 - 2)), round(0.2 + R() * 1.5, 2), round(R() * 6.28, 2)]);
    const freq = R() < 0.6 ? parts[0][0] : 1 + Math.floor(R() * (rate / 2 - 2));
    cases.push([make(rate, parts), freq, rate]);
  }
  return cases;
}

module.exports = {
  id: 'waveStrength', fnName: 'waveStrength', predictAnswer: 1,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference, generateInputs, compare: (e, a) => close(e, a, 1e-6),
  hints: [
    { en: 'For every sample n, the test angle is 2π × freq × n ÷ rate. Multiply the sample by cos(angle) into one total and by sin(angle) into another.', ta: 'ஒவ்வொரு sample n-க்கும் test angle = 2π × freq × n ÷ rate. Sample-ஐ cos(angle)-ஆல பெருக்கி ஒரு total-லயும், sin(angle)-ஆல பெருக்கி இன்னொரு total-லயும் சேருங்க.' },
    { en: 'Strength = 2 ÷ (number of samples) × √(cosTotal² + sinTotal²). Math.hypot does the square root of squares.', ta: 'Strength = 2 ÷ (samples எண்ணிக்கை) × √(cosTotal² + sinTotal²). Math.hypot square root of squares-ஐ பண்ணும்.' },
    { en: 'let re = 0, im = 0;\nfor (let n = 0; n < signal.length; n++) {\n  const angle = 2 * Math.PI * freq * n / rate;\n  re += signal[n] * Math.cos(angle);\n  im += signal[n] * Math.sin(angle);\n}\nreturn 2 / signal.length * Math.hypot(re, im);', ta: 'let re = 0, im = 0;\nfor (let n = 0; n < signal.length; n++) {\n  const angle = 2 * Math.PI * freq * n / rate;\n  re += signal[n] * Math.cos(angle);\n  im += signal[n] * Math.sin(angle);\n}\nreturn 2 / signal.length * Math.hypot(re, im);' },
  ],
};
