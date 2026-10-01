// 🎮 Campus Quest · World 1 · Polynomials
export default {
  id: 'jumpHeight', fnName: 'jumpHeight', product: 'game', world: 1, lesson: 'polynomials',
  title: { en: 'A jump that feels right', ta: 'சரியா தோணுற ஒரு jump' },
  story: {
    en: 'Campus Quest needs a jump to cross the rain puddles. Every frame the game asks your function: launched upwards at speed v, with gravity g, how high is the character after t seconds? A jump is a degree-2 polynomial.',
    ta: 'Campus Quest-ல மழை குட்டைகளை தாண்ட ஒரு jump வேணும். ஒவ்வொரு frame-லயும் game உங்க function-கிட்ட கேக்குது: v speed-ல மேல எகிறி, g gravity-ல, t seconds-க்கு அப்புறம் character எவ்வளவு உயரத்துல இருக்கும்? Jump ஒரு degree-2 polynomial.',
  },
  predict: {
    q: { en: 'With h = 8t − 5t², what is the height at t = 1.6 s?', ta: 'h = 8t − 5t²-ல, t = 1.6 s-ல உயரம் என்ன?' },
    options: ['0: it has just landed', '3.2 m', '8 m', '−5 m'],
  },
  signature: 'jumpHeight(v, g, t)',
  fill: `function jumpHeight(v, g, t) {
  const h = v * t - 0.5 * g * ___;   // TODO: which power of t makes it curve down?
  return Math.max(0, h);              // never below the ground
}`,
  write: `function jumpHeight(v, g, t) {
  // TODO: height after t seconds: v·t − ½·g·t²
  // The character can never go below the ground (height 0).
}`,
  sampleTests: [
    { args: [8, 10, 0.5], expect: 2.75 },
    { args: [8, 10, 0.8], expect: 3.2 },
    { args: [8, 10, 2.0], expect: 0 },
  ],
  // Instant payoff: your character hops over puddles using YOUR jump.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#E4EEDC'; ctx.fillRect(0, 0, W, H);
    const gy = H - 70; ctx.fillStyle = '#C9D8BE'; ctx.fillRect(0, gy, W, 70);
    for (let i = 0; i < 4; i++) { ctx.fillStyle = '#9DB3D6'; ctx.beginPath(); ctx.ellipse(110 + i * 150, gy + 8, 40, 9, 0, 0, 7); ctx.fill(); }
    ctx.font = '700 15px Catamaran, system-ui'; ctx.fillStyle = '#16294F'; ctx.fillText('Hop over the rain puddles', 16, 24);
    const cycle = 1.6, time = (t / 1000) % (cycle + 0.3), jt = Math.min(time, cycle);
    const x = 40 + ((t / 1000) * 90) % (W - 40);
    let h = 0;
    if (fn) { const v = fn(8, 10, jt); h = typeof v === 'number' && isFinite(v) ? v : 0; }
    const y = gy - 22 - h * 45;
    ctx.fillStyle = '#1E3E7B'; ctx.beginPath(); ctx.arc(x, y, 20, 0, 7); ctx.fill();
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write jumpHeight to make the character jump', 16, 48); }
    else { ctx.fillStyle = '#7A600A'; ctx.fillText(`height ${h.toFixed(2)} m`, 16, 48); }
  },
};
