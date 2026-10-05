// World 1 · Gradient descent · 🏢 CampusOps: learn the price per km, one step at a time.
const { rng, round, close } = require('./_shared');

// One gradient-descent step for the model fare = w × km, using the average squared error.
function reference(w, rides, rate) {
  const grad = (2 / rides.length) * rides.reduce((s, [km, fare]) => s + (w * km - fare) * km, 0);
  return w - rate * grad;
}

function generateInputs(seed) {
  const R = rng(seed);
  const fest = [[2, 60], [4, 115], [5, 140], [8, 230], [10, 285]];
  const cases = [[0, fest, 0.01], [23.88, fest, 0.01], [28.5646, fest, 0.01], [25, [[4, 115]], 0.01]];
  for (let i = 0; i < 6; i++) {
    const price = 10 + R() * 30, n = 3 + Math.floor(R() * 6);
    const rides = Array.from({ length: n }, () => { const km = round(1 + R() * 19, 1); return [km, Math.round(price * km + (R() - 0.5) * 20)]; });
    cases.push([round(R() * 50, 2), rides, round(0.001 + R() * 0.004, 4)]);
  }
  return cases;
}

module.exports = {
  id: 'learnPrice', fnName: 'gradientStep', predictAnswer: 0,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference, generateInputs, compare: (e, a) => close(e, a, 1e-9),
  hints: [
    { en: 'For each ride, the miss is w × km − fare. Multiply each miss by its km, add them up, then multiply by 2 ÷ number of rides: that is the slope.', ta: 'ஒவ்வொரு ride-க்கும் miss = w × km − fare. ஒவ்வொரு miss-ஐயும் அதோட km-ஆல பெருக்கி, கூட்டி, அப்புறம் 2 ÷ rides எண்ணிக்கை-ஆல பெருக்குங்க: அது தான் slope.' },
    { en: 'Then the update rule: return w − rate × slope.', ta: 'அப்புறம் update rule: w − rate × slope-ஐ return பண்ணுங்க.' },
    { en: 'const grad = 2 / rides.length * rides.reduce((s, [km, fare]) => s + (w * km - fare) * km, 0);\nreturn w - rate * grad;', ta: 'const grad = 2 / rides.length * rides.reduce((s, [km, fare]) => s + (w * km - fare) * km, 0);\nreturn w - rate * grad;' },
  ],
};
