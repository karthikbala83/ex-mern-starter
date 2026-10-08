// World 1 · Vectors & matrices · 🎮 Campus Quest: the fest windmill.
const { rng, round, close } = require('./_shared');

// Rotate (x, y) around the centre (cx, cy) by angleDeg, anticlockwise in maths axes.
function reference(x, y, cx, cy, angleDeg) {
  const r = angleDeg * Math.PI / 180, dx = x - cx, dy = y - cy;   // shift so the centre is the origin
  return { x: cx + dx * Math.cos(r) - dy * Math.sin(r), y: cy + dx * Math.sin(r) + dy * Math.cos(r) };
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[1, 0, 0, 0, 90], [5, 3, 3, 3, 180], [2, 2, 1, 1, 0], [0, 2, 0, 0, 90]];
  for (let i = 0; i < 6; i++) cases.push([round(R() * 200 - 100, 2), round(R() * 200 - 100, 2), round(R() * 100 - 50, 2), round(R() * 100 - 50, 2), Math.round(R() * 720 - 360)]);
  return cases;
}

module.exports = {
  id: 'rotateSprite', fnName: 'rotatePoint', predictAnswer: 0,
  points: { predict: 10, fill: 20, write: 50, bonus: 20, hint: -5, firstTry: 10 },
  bonusMustUse: 'math.',   // bonus stage: code must actually use mathjs
  reference, generateInputs, compare: (e, a) => close(e, a, 1e-6),
  hints: [
    { en: 'First shift the point so the centre is at the origin: dx = x − cx, dy = y − cy.', ta: 'முதல்ல centre origin-ல இருக்கிற மாதிரி point-ஐ நகர்த்துங்க: dx = x − cx, dy = y − cy.' },
    { en: 'Rotate with the matrix: dx·cos − dy·sin and dx·sin + dy·cos. Then shift back by adding cx and cy.', ta: 'Matrix வெச்சு சுழற்றுங்க: dx·cos − dy·sin, dx·sin + dy·cos. அப்புறம் cx, cy கூட்டி திரும்ப நகர்த்துங்க.' },
    { en: 'const r = angleDeg * Math.PI / 180, dx = x - cx, dy = y - cy;\nreturn { x: cx + dx * Math.cos(r) - dy * Math.sin(r), y: cy + dx * Math.sin(r) + dy * Math.cos(r) };', ta: 'const r = angleDeg * Math.PI / 180, dx = x - cx, dy = y - cy;\nreturn { x: cx + dx * Math.cos(r) - dy * Math.sin(r), y: cy + dx * Math.sin(r) + dy * Math.cos(r) };' },
  ],
};
