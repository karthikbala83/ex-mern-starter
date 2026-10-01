// 🎮 Campus Quest · World 1 · Statistics
export default {
  id: 'leaderboardStats', fnName: 'leaderboardStats', product: 'game', world: 1, lesson: 'statistics',
  title: { en: 'The typical player', ta: 'Typical player' },
  story: {
    en: 'The Campus Quest leaderboard wants a header line: "Typical player: ___ points". A few pro players score in the thousands, so the mean would mislead. Your function returns both the mean and the median, and the game shows the honest one.',
    ta: 'Campus Quest leaderboard-க்கு ஒரு header line வேணும்: "Typical player: ___ points". சில pro players ஆயிரக்கணக்குல score பண்றாங்க, அதனால mean தப்பா வழிகாட்டும். உங்க function mean, median ரெண்டையும் return பண்ணும், game நேர்மையானதை காட்டும்.',
  },
  predict: {
    q: { en: 'Scores: 10, 20, 30, 40, 1000. What is the median?', ta: 'Scores: 10, 20, 30, 40, 1000. Median என்ன?' },
    options: ['220', '30', '25', '1000'],
  },
  signature: 'leaderboardStats(scores)',
  fill: `function leaderboardStats(scores) {
  const mean = scores.reduce((s, x) => s + x, 0) / scores.length;
  const s = [...scores].sort((a, b) => a - b);      // sort a COPY
  const n = s.length;
  const median = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[___]) / 2;   // TODO: the other middle value
  return { mean, median };
}`,
  write: `function leaderboardStats(scores) {
  // TODO: return { mean, median }
  // Careful: sort a copy, and handle an even number of players.
}`,
  sampleTests: [
    { args: [[10, 20, 30, 40, 1000]], expect: { mean: 220, median: 30 } },
    { args: [[5, 1, 4, 2]], expect: { mean: 3, median: 3 } },
    { args: [[7]], expect: { mean: 7, median: 7 } },
  ],
  // Instant payoff: a live leaderboard with YOUR mean and median lines.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, W, H);
    const base = [120, 180, 210, 240, 260, 300, 320, 380, 410, 460];
    const pro = 1500 + 900 * (0.5 + 0.5 * Math.sin(t / 1500));          // a pro player whose score keeps changing
    const scores = [...base, Math.round(pro)];
    const mx = 2400, ox = 30, oy = H - 40, bw = (W - 60) / scores.length - 6;
    ctx.font = '700 15px Catamaran, system-ui';
    scores.forEach((v, i) => { const h = v / mx * (H - 110); ctx.fillStyle = v > 1000 ? '#C8553D' : '#9DB3D6'; ctx.fillRect(ox + i * (bw + 6), oy - h, bw, h); });
    ctx.fillStyle = '#16294F'; ctx.fillText('Campus Quest leaderboard (one pro player in red)', 16, 24);
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write leaderboardStats to show the typical player', 16, 48); return; }
    const r = fn(scores);
    [[r.mean, '#C8553D', 'mean'], [r.median, '#547B5C', 'median']].forEach(([v, c, l]) => { const y = oy - v / mx * (H - 110); ctx.strokeStyle = c; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(W - 20, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = c; ctx.fillText(`${l} ${Math.round(v)}`, W - 120, y - 6); });
    ctx.fillStyle = '#547B5C'; ctx.font = '800 17px Catamaran, system-ui'; ctx.fillText(`Typical player: ${Math.round(r.median)} points`, 16, 48);
  },
};
