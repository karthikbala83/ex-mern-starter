// World 1 · Probability · 🏢 CampusOps: pick a safe OTP policy.
const { rng, close } = require('./_shared');

// A thief guesses `attempts` DIFFERENT codes out of 10^digits possibilities.
function reference(digits, attempts) {
  const total = 10 ** digits;
  return Math.min(1, attempts / total);
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[2, 3], [4, 3], [6, 3], [6, 5]];
  for (let i = 0; i < 4; i++) cases.push([1 + Math.floor(R() * 6), 1 + Math.floor(R() * 10)]);
  cases.push([1, 20]);                          // edge: more tries than codes → certain (1)
  return cases;
}

module.exports = {
  id: 'otpBreakChance',
  fnName: 'otpBreakChance',
  predictAnswer: 2,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference,
  generateInputs,
  compare: (e, a) => close(e, a, 1e-9),
  hints: [
    { en: 'How many different codes exist with `digits` digits? (2 digits → 100)', ta: '`digits` digits-ல எத்தனை codes இருக்கு? (2 digits → 100)' },
    { en: 'chance = attempts ÷ total codes. It can never be more than 1.', ta: 'chance = attempts ÷ மொத்த codes. அது 1-ஐ தாண்டவே கூடாது.' },
    { en: 'const total = 10 ** digits;\nreturn Math.min(1, attempts / total);', ta: 'const total = 10 ** digits;\nreturn Math.min(1, attempts / total);' },
  ],
};
