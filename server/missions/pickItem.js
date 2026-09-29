// World 1 · Probability · 🎮 Campus Quest: which item appears in the chest?
const { rng, round, close } = require('./_shared');

// Correct answer. r is a random number in [0, 1). chances add up to 1.
function reference(items, chances, r) {
  let running = 0;
  for (let i = 0; i < items.length; i++) {
    running += chances[i];                 // cumulative chance: 0.6, 0.9, 1.0 …
    if (r < running) return items[i];
  }
  return items[items.length - 1];          // guards against 0.99999 rounding
}

function generateInputs(seed) {
  const R = rng(seed);
  const sets = [
    [['notes', 'pen', 'gold-star'], [0.6, 0.3, 0.1]],
    [['tea', 'samosa', 'biryani', 'ice-cream'], [0.4, 0.3, 0.2, 0.1]],
    [['bronze', 'silver', 'gold'], [0.7, 0.25, 0.05]],
  ];
  const cases = [];
  for (let i = 0; i < 8; i++) {
    const [items, chances] = sets[i % sets.length];
    cases.push([items, chances, round(R(), 4)]);
  }
  cases.push([['a', 'b'], [0.5, 0.5], 0]);        // edge: r = 0 → first item
  cases.push([['a', 'b'], [0.5, 0.5], 0.9999]);   // edge: near 1 → last item
  return cases;
}

module.exports = {
  id: 'pickItem',
  fnName: 'pickItem',
  predictAnswer: 1,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference,
  generateInputs,
  compare: (e, a) => close(e, a),
  hints: [
    { en: 'Walk through the items keeping a running total of their chances.', ta: 'Items-ஐ ஒவ்வொண்ணா பார்த்து, chances-ஓட running total வெச்சுக்கோங்க.' },
    { en: 'Return the first item where r < runningTotal.', ta: 'r < runningTotal ஆகுற முதல் item-ஐ return பண்ணுங்க.' },
    { en: 'let running = 0;\nfor (let i = 0; i < items.length; i++) {\n  running += chances[i];\n  if (r < running) return items[i];\n}', ta: 'let running = 0;\nfor (let i = 0; i < items.length; i++) {\n  running += chances[i];\n  if (r < running) return items[i];\n}' },
  ],
};
