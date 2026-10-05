// 🏢 CampusOps · World 1 · Gradient descent
export default {
  id: 'learnPrice', fnName: 'gradientStep', product: 'app', world: 1, lesson: 'gradient',
  title: { en: 'Learn the price per km', ta: 'km-க்கு விலையை கத்துக்கோங்க' },
  story: {
    en: 'CampusOps runs the college cab pool and wants to learn a fair price per km from past rides. The training loop is ready: it calls your function again and again. Your function takes ONE gradient-descent step and returns the improved price.',
    ta: 'CampusOps college cab pool-ஐ நடத்துது, பழைய rides-ல இருந்து km-க்கு நியாயமான விலையை கத்துக்கணும். Training loop ready: அது உங்க function-ஐ திரும்ப திரும்ப call பண்ணும். உங்க function ஒரே ஒரு gradient-descent step எடுத்து, மேம்பட்ட விலையை return பண்ணணும்.',
  },
  predict: {
    q: { en: 'w = 25, the slope is −120, the rate is 0.01. What is the new w?', ta: 'w = 25, slope −120, rate 0.01. புது w என்ன?' },
    options: ['26.2', '23.8', '25', '145'],
  },
  signature: 'gradientStep(w, rides, rate)',
  fill: `function gradientStep(w, rides, rate) {
  // rides look like [[2, 60], [4, 115], ...]  →  [km, fare]
  const grad = 2 / rides.length * rides.reduce((s, [km, fare]) => s + (w * km - fare) * ___, 0);   // TODO
  return w - rate * grad;
}`,
  write: `function gradientStep(w, rides, rate) {
  // rides look like [[2, 60], [4, 115], ...]  →  [km, fare]
  // TODO: slope = 2/n × Σ (w·km − fare) × km, then return w − rate × slope
}`,
  sampleTests: [
    { args: [0, [[2, 60], [4, 115], [5, 140], [8, 230], [10, 285]], 0.01], expect: 23.88 },
    { args: [25, [[4, 115]], 0.01], expect: 26.2 },
    { args: [28.75, [[4, 115]], 0.01], expect: 28.75 },
  ],
  // Instant payoff: the training loop runs YOUR step and the fare line learns live.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, W, H);
    const rides = [[2, 60], [4, 115], [5, 140], [8, 230], [10, 285]], ox = 50, oy = H - 40, X = (k) => ox + k / 11 * (W - 90), Y = (v) => oy - v / 320 * (H - 100);
    ctx.font = '700 15px Catamaran, system-ui'; ctx.fillStyle = '#16294F'; ctx.fillText('College cab pool: learning the price per km', 16, 24);
    rides.forEach(([k, f]) => { ctx.beginPath(); ctx.arc(X(k), Y(f), 7, 0, 7); ctx.fillStyle = '#16294F'; ctx.fill(); });
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write gradientStep to start training', 16, 48); return; }
    const steps = Math.floor(t / 600) % 12; let w = 0;
    for (let i = 0; i < steps; i++) { const n = fn(w, rides, 0.01); w = typeof n === 'number' && isFinite(n) ? n : w; }
    ctx.strokeStyle = '#C9A21F'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(11), Y(w * 11)); ctx.stroke();
    ctx.fillStyle = Math.abs(w - 28.56) < 0.1 ? '#547B5C' : '#7A600A'; ctx.font = '800 17px Catamaran, system-ui'; ctx.fillText(`step ${steps}: ₹${w.toFixed(2)} per km`, 16, 48);
  },
};
