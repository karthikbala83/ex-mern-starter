// World 1 · sin & cos A · 🎮 Campus Quest: walk in any direction.
const { rng, round, close } = require('./_shared');

// Angle in DEGREES: 0 = right (east), 90 = up (north).
// Screen y grows DOWNWARD, so moving "up" means y gets smaller.
function reference(x, y, angleDeg, speed) {
  const rad = angleDeg * Math.PI / 180;           // machines think in radians
  return { x: x + speed * Math.cos(rad), y: y - speed * Math.sin(rad) };
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[100, 100, 0, 10], [100, 100, 90, 10], [100, 100, 180, 5], [50, 50, 270, 4]];
  for (let i = 0; i < 6; i++) cases.push([round(R() * 400), round(R() * 400), Math.floor(R() * 360), round(1 + R() * 20, 2)]);
  return cases;
}

module.exports = {
  id: 'moveToward',
  bonusMustUse: 'math.',   // bonus stage: code must actually use the package
  fnName: 'moveToward',
  predictAnswer: 1,
  points: { predict: 10, fill: 20, write: 50, bonus: 20, hint: -5, firstTry: 10 },
  reference,
  generateInputs,
  compare: (e, a) => close(e, a, 1e-6),
  hints: [
    { en: 'Convert the angle to radians first: degrees × π ÷ 180.', ta: 'முதல்ல angle-ஐ radians-ஆ மாத்துங்க: degrees × π ÷ 180.' },
    { en: 'Sideways step = speed × cos(angle). Upward step = speed × sin(angle). On screen, up means y goes DOWN.', ta: 'பக்கவாட்டு அடி = speed × cos(angle). மேல் அடி = speed × sin(angle). Screen-ல மேல-ன்னா y குறையும்.' },
    { en: 'const rad = angleDeg * Math.PI / 180;\nreturn { x: x + speed * Math.cos(rad), y: y - speed * Math.sin(rad) };', ta: 'const rad = angleDeg * Math.PI / 180;\nreturn { x: x + speed * Math.cos(rad), y: y - speed * Math.sin(rad) };' },
  ],
};
