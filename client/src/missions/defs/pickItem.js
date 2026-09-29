// 🎮 Campus Quest · World 1 · Probability
// Public half of the mission. Answers, hidden tests and hints live on the SERVER.
export default {
  id: 'pickItem', fnName: 'pickItem', product: 'game', world: 1, lesson: 'probability',
  title: { en: 'Open the mystery chest', ta: 'Mystery chest-ஐ திறங்க' },
  story: {
    en: 'Campus Quest hides chests around campus. Each chest gives notes 60% of the time, a pen 30%, and a rare gold star 10%. The game rolls a random number r between 0 and 1. Your function decides which item that r gives.',
    ta: 'Campus Quest-ல campus முழுக்க chests ஒளிஞ்சிருக்கு. ஒவ்வொரு chest-உம் 60% notes, 30% pen, 10% அரிய gold star தரும். Game 0-க்கும் 1-க்கும் நடுவுல ஒரு random number r எடுக்குது. அந்த r-க்கு எந்த item-னு உங்க function முடிவு பண்ணுது.',
  },
  predict: {
    q: { en: 'Chances are notes 0.6, pen 0.3, gold star 0.1. If r = 0.75, which item?', ta: 'Chances: notes 0.6, pen 0.3, gold star 0.1. r = 0.75-னா எந்த item?' },
    options: ['notes', 'pen', 'gold-star', 'nothing'],
  },
  signature: 'pickItem(items, chances, r)',
  fill: `function pickItem(items, chances, r) {
  let running = 0;
  for (let i = 0; i < items.length; i++) {
    running += ___;                 // TODO: add this item's chance
    if (r < running) return items[i];
  }
  return items[items.length - 1];
}`,
  write: `function pickItem(items, chances, r) {
  // TODO: return the item that r lands on.
  // chances add up to 1. Example: [0.6, 0.3, 0.1]
}`,
  sampleTests: [
    { args: [['notes', 'pen', 'gold-star'], [0.6, 0.3, 0.1], 0.2], expect: 'notes' },
    { args: [['notes', 'pen', 'gold-star'], [0.6, 0.3, 0.1], 0.75], expect: 'pen' },
    { args: [['notes', 'pen', 'gold-star'], [0.6, 0.3, 0.1], 0.95], expect: 'gold-star' },
  ],
  // Instant payoff: open 300 chests with YOUR function and compare with the promised chances.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, W, H);
    const items = ['notes', 'pen', 'gold-star'], ch = [0.6, 0.3, 0.1], cols = ['#1E3E7B', '#547B5C', '#C9A21F'];
    const n = Math.min(300, Math.floor(t / 10)); const count = { notes: 0, pen: 0, 'gold-star': 0 };
    let a = 12345;
    for (let i = 0; i < n; i++) { a = (a * 1103515245 + 12345) % 2147483648; const r = a / 2147483648; const it = fn ? fn(items, ch, r) : null; if (it in count) count[it]++; }
    ctx.font = '700 16px Catamaran, system-ui'; ctx.fillStyle = '#16294F'; ctx.fillText(`Chests opened: ${n}`, 16, 26);
    items.forEach((it, i) => {
      const x = 40 + i * (W - 60) / 3, bw = (W - 120) / 3, h = n ? (count[it] / n) * (H - 90) : 0;
      ctx.fillStyle = cols[i]; ctx.fillRect(x, H - 40 - h, bw, h);
      ctx.strokeStyle = '#C8553D'; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(x - 4, H - 40 - ch[i] * (H - 90)); ctx.lineTo(x + bw + 4, H - 40 - ch[i] * (H - 90)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#16294F'; ctx.fillText(`${it} ${n ? Math.round(count[it] / n * 100) : 0}%`, x, H - 16);
    });
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write pickItem to open the chests', 16, 50); }
  },
};
