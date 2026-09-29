// World 1 · sin & cos C · 🎮 Campus Quest: rain that sways in the wind.
const { rng, round, close } = require('./_shared');

// A raindrop starts at x0. Wind pushes it side to side like a wave.
// Each drop has its own phase so they don't all sway together.
function reference(x0, time, wind, phase) {
  return x0 + wind * Math.sin(2 * time + phase);
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[200, 0, 30, 0], [200, Math.PI / 4, 30, 0], [100, 1, 0, 1]];
  for (let i = 0; i < 7; i++) cases.push([round(R() * 800), round(R() * 10), round(R() * 80, 2), round(R() * 2 * Math.PI)]);
  return cases;
}

module.exports = {
  id: 'rainSway',
  fnName: 'rainSway',
  predictAnswer: 0,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference,
  generateInputs,
  compare: (e, a) => close(e, a, 1e-6),
  hints: [
    { en: 'The sway goes up and down forever. Which function repeats like a wave?', ta: 'Sway முடிவில்லாம முன்னும் பின்னும் போகுது. எந்த function wave மாதிரி திரும்ப வரும்?' },
    { en: 'x = x0 + wind × sin(2 × time + phase)', ta: 'x = x0 + wind × sin(2 × time + phase)' },
    { en: 'return x0 + wind * Math.sin(2 * time + phase);', ta: 'return x0 + wind * Math.sin(2 * time + phase);' },
  ],
};
