// World 1 · Statistics · 🎮 Campus Quest: the "typical player" on the leaderboard.
const { rng, close } = require('./_shared');

function reference(scores) {
  const mean = scores.reduce((s, x) => s + x, 0) / scores.length;
  const s = [...scores].sort((a, b) => a - b);          // copy: never reorder the caller's array
  const n = s.length;
  const median = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  return { mean, median };
}

function generateInputs(seed) {
  const R = rng(seed);
  const cases = [[[10, 20, 30, 40, 1000]], [[5, 1, 4, 2]], [[7]]];
  for (let i = 0; i < 7; i++) {
    const n = 4 + Math.floor(R() * 9);                    // 4..12 players, odd and even
    const arr = Array.from({ length: n }, () => Math.floor(R() * 900) + 50);
    if (i % 2 === 0) arr[Math.floor(R() * n)] = 5000 + Math.floor(R() * 5000);   // a "pro" outlier
    cases.push([arr]);
  }
  return cases;
}

module.exports = {
  id: 'leaderboardStats', fnName: 'leaderboardStats', predictAnswer: 1,
  points: { predict: 10, fill: 20, write: 50, bonus: 0, hint: -5, firstTry: 10 },
  reference, generateInputs, compare: (e, a) => close(e, a, 1e-9),
  hints: [
    { en: 'Mean: add all scores, divide by how many. Median: sort a COPY, then take the middle.', ta: 'Mean: எல்லா scores-ஐயும் கூட்டி, எத்தனைன்னு வகுங்க. Median: ஒரு COPY-ஐ sort பண்ணி, நடுவுல எடுங்க.' },
    { en: 'With an even count there are two middle values: positions n/2 − 1 and n/2. Average them.', ta: 'Even count-ல நடுவுல ரெண்டு values: n/2 − 1, n/2 positions. அதோட average எடுங்க.' },
    { en: 'const s = [...scores].sort((a, b) => a - b);\nconst n = s.length;\nconst median = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;', ta: 'const s = [...scores].sort((a, b) => a - b);\nconst n = s.length;\nconst median = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;' },
  ],
};
