// 🎮 Campus Quest · World 1 · Gradient descent
export default {
  id: 'tuneDifficulty', fnName: 'tuneDifficulty', product: 'game', world: 1, lesson: 'gradient',
  title: { en: 'A game that adapts to you', ta: 'உங்களுக்கு ஏத்த மாதிரி மாறுற game' },
  story: {
    en: 'Campus Quest should feel fair to everyone: a beginner and a pro should both win about half their games. After each round, the game measures the win rate and asks your function to nudge the difficulty, just like a gradient step towards the target.',
    ta: 'Campus Quest எல்லாருக்கும் நியாயமா இருக்கணும்: beginner-உம் pro-வும் ரெண்டு பேரும் கிட்டத்தட்ட பாதி games ஜெயிக்கணும். ஒவ்வொரு round-க்கும் அப்புறம், game win rate-ஐ அளந்து, target நோக்கி ஒரு gradient step மாதிரி difficulty-ஐ கொஞ்சம் மாத்த உங்க function-கிட்ட கேக்குது.',
  },
  predict: {
    q: { en: 'Players are winning 80% of games and the target is 50%. Which way should difficulty move?', ta: 'Players 80% games ஜெயிக்கிறாங்க, target 50%. Difficulty எந்த பக்கம் போகணும்?' },
    options: ['Up: make it harder', 'Down: make it easier', 'Stay the same', 'Reset to 1'],
  },
  signature: 'tuneDifficulty(difficulty, winRate, target, rate)',
  fill: `function tuneDifficulty(difficulty, winRate, target, rate) {
  const next = difficulty + rate * (winRate ___ target);   // TODO: the error
  return Math.min(10, Math.max(1, next));                  // stay between 1 and 10
}`,
  write: `function tuneDifficulty(difficulty, winRate, target, rate) {
  // TODO: nudge difficulty by rate × (winRate − target), then keep it between 1 and 10
}`,
  sampleTests: [
    { args: [5, 0.8, 0.5, 4], expect: 6.2 },
    { args: [5, 0.2, 0.5, 4], expect: 3.8 },
    { args: [9.8, 1, 0.5, 4], expect: 10 },
  ],
  // Instant payoff: two players of different skill; watch YOUR rule settle each one's difficulty.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, W, H);
    const ox = 50, oy = H - 40, w = W - 90, h = H - 100, rounds = 30, shown = Math.floor(t / 250) % (rounds + 8);
    const X = (r) => ox + r / rounds * w, Y = (d) => oy - (d - 1) / 9 * h;
    ctx.font = '700 15px Catamaran, system-ui'; ctx.fillStyle = '#16294F'; ctx.fillText('Difficulty per round for two players', 16, 24);
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write tuneDifficulty to adapt the game', 16, 48); return; }
    [[3, '#547B5C', 'beginner'], [8, '#C8553D', 'pro']].forEach(([skill, col, name], j) => {
      let d = 5; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0), Y(d));
      for (let r = 1; r <= Math.min(shown, rounds); r++) { const win = 1 / (1 + Math.exp(d - skill)); const n = fn(d, win, 0.5, 2.5); d = typeof n === 'number' && isFinite(n) ? n : d; ctx.lineTo(X(r), Y(d)); }
      ctx.stroke(); ctx.fillStyle = col; ctx.fillText(`${name}: difficulty ${d.toFixed(1)}`, 16 + j * 230, 48);
    });
  },
};
