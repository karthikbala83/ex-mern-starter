// World 1 · Polynomials · 🎮 Campus Quest: a jump that feels right.
const { rng, round, close } = require('./_shared');

// h(t) = v·t − ½·g·t², but a character never goes below the ground.
function reference(v, g, t) {
  return Math.max(0, v * t - 0.5 * g * t * t);
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[8, 10, 0.5], [8, 10, 0.8], [8, 10, 1.6], [8, 10, 2.0], [5, 1.6, 3]];   // last-but-one: after landing → 0
  for (let i = 0; i < 7; i++) {
    const v = round(3 + R() * 12, 2), g = [9.8, 10, 1.6, 20][i % 4];
    const land = 2 * v / g;
    cases.push([v, g, round(R() * land * 1.3, 3)]);   // sometimes after landing, to test the ground rule
  }
  return cases;
}

module.exports = {
  id: 'jumpHeight', fnName: 'jumpHeight', predictAnswer: 0,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference, generateInputs, compare: (e, a) => close(e, a, 1e-9),
  hints: [
    { en: 'Height = v·t − ½·g·t². The t² term is what makes the path curve back down.', ta: 'உயரம் = v·t − ½·g·t². t² term தான் பாதையை மறுபடியும் கீழ வளைக்குது.' },
    { en: 'After landing the formula goes negative. Characters cannot go underground: clamp with Math.max(0, …).', ta: 'தரையிறங்கின பிறகு formula negative ஆகும். Characters தரைக்கு கீழ போக முடியாது: Math.max(0, …) வெச்சு clamp பண்ணுங்க.' },
    { en: 'return Math.max(0, v * t - 0.5 * g * t * t);', ta: 'return Math.max(0, v * t - 0.5 * g * t * t);' },
  ],
};
