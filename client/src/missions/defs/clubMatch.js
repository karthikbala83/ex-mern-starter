// 🏢 CampusOps · World 1 · Vectors & matrices
export default {
  id: 'clubMatch', fnName: 'cosineSimilarity', product: 'app', world: 1, lesson: 'vectors',
  title: { en: 'Club recommendations', ta: 'Club recommendations' },
  story: {
    en: 'CampusOps wants to suggest clubs to first-years. Each student and each club is a vector of interests: coding, music, sports, art. Your function measures how similar two vectors are, and CampusOps recommends the club with the highest score.',
    ta: 'CampusOps first-years-க்கு clubs-ஐ suggest பண்ணணும். ஒவ்வொரு student-உம் ஒவ்வொரு club-உம் interests-ஓட ஒரு vector: coding, music, sports, art. உங்க function ரெண்டு vectors எவ்வளவு ஒத்திருக்குன்னு அளக்கும், CampusOps அதிக score உள்ள club-ஐ recommend பண்ணும்.',
  },
  predict: {
    q: { en: 'Vectors [2, 2] and [4, 4] point in exactly the same direction. What is their cosine similarity?', ta: '[2, 2], [4, 4] vectors சரியா அதே திசையில point பண்ணுது. அவற்றோட cosine similarity என்ன?' },
    options: ['0.5', '1', '2', '0'],
  },
  signature: 'cosineSimilarity(a, b)',
  fill: `function cosineSimilarity(a, b) {
  const dot = a.reduce((s, x, i) => s + x * b[i], 0);
  const lenA = Math.hypot(...a), lenB = Math.hypot(...b);
  if (lenA === 0 || lenB === 0) return 0;          // a student with no interests yet
  return dot / (___);                               // TODO
}`,
  write: `function cosineSimilarity(a, b) {
  // TODO: dot product ÷ (length of a × length of b)
  // Return 0 if either vector has length 0.
}`,
  sampleTests: [
    { args: [[2, 2], [4, 4]], expect: 1 },
    { args: [[1, 0], [0, 1]], expect: 0 },
    { args: [[0, 0, 0, 0], [1, 2, 3, 4]], expect: 0 },
  ],
  bonus: {
    pkg: 'mathjs', mustUse: 'math.',
    note: { en: 'mathjs has math.dot and math.norm. You still handle the zero-length case yourself.', ta: 'mathjs-ல math.dot, math.norm இருக்கு. Zero-length case-ஐ நீங்களே handle பண்ணணும்.' },
    starter: `function cosineSimilarity(a, b) {
  // TODO: use math.dot(a, b), math.norm(a), math.norm(b)
}`,
  },
  // Instant payoff: three students get club suggestions from YOUR function.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, W, H);
    const clubs = { 'Coding': [5, 0, 0, 1], 'Music': [0, 5, 0, 2], 'Sports': [0, 1, 5, 0], 'Design': [3, 1, 0, 5] };
    const students = [['Priya', [5, 1, 0, 4]], ['Kavin', [0, 5, 5, 0]], ['Meena', [4, 0, 0, 2]]];
    ctx.font = '700 15px Catamaran, system-ui'; ctx.fillStyle = '#16294F'; ctx.fillText('CampusOps · club suggestions for first-years', 16, 24);
    students.forEach(([name, v], i) => {
      const y = 70 + i * 110; ctx.fillStyle = '#16294F'; ctx.font = '800 17px Catamaran, system-ui'; ctx.fillText(name, 20, y + 20);
      if (!fn) { ctx.fillStyle = '#A9B7CE'; ctx.fillRect(110, y, W - 140, 60); return; }
      const scores = Object.entries(clubs).map(([c, cv]) => [c, fn(v, cv)]).sort((a, b) => b[1] - a[1]);
      scores.forEach(([c, s], j) => { const x = 110 + j * ((W - 140) / 4); const sv = typeof s === 'number' && isFinite(s) ? s : 0;
        ctx.fillStyle = j === 0 ? '#547B5C' : '#D7E1F0'; ctx.fillRect(x, y + 40 - sv * 40, (W - 140) / 4 - 8, sv * 40 + 4);
        ctx.fillStyle = j === 0 ? '#547B5C' : '#56647E'; ctx.font = '700 13px Catamaran, system-ui'; ctx.fillText(`${c} ${sv.toFixed(2)}`, x, y + 60); });
    });
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write cosineSimilarity to suggest clubs', 16, 48); }
  },
};
