// 🎮 Campus Quest · World 1 · Fourier
export default {
  id: 'waveStrength', fnName: 'waveStrength', product: 'game', world: 1, lesson: 'fourier',
  title: { en: 'The fest stage visualiser', ta: 'Fest stage visualiser' },
  story: {
    en: 'At the Campus Quest fest stage, light bars should jump with the music: bass, mid and treble. Every frame the game asks your function how strong one frequency is inside the latest slice of sound. This is the matching trick from the lesson.',
    ta: 'Campus Quest fest stage-ல light bars music-க்கு ஏத்த மாதிரி குதிக்கணும்: bass, mid, treble. ஒவ்வொரு frame-லயும் game சமீபத்திய sound slice-க்குள்ள ஒரு frequency எவ்வளவு strong-ன்னு உங்க function-கிட்ட கேக்குது. இது lesson-ல பார்த்த matching trick.',
  },
  predict: {
    q: { en: 'A pure 10 Hz wave of amplitude 1. What strength should your function report at 30 Hz?', ta: 'Amplitude 1 உள்ள ஒரு pure 10 Hz wave. 30 Hz-ல உங்க function என்ன strength சொல்லணும்?' },
    options: ['1', 'About 0', '3', '0.33'],
  },
  signature: 'waveStrength(signal, freq, rate)',
  fill: `function waveStrength(signal, freq, rate) {
  let re = 0, im = 0;
  for (let n = 0; n < signal.length; n++) {
    const angle = 2 * Math.PI * freq * n / rate;
    re += signal[n] * Math.cos(angle);
    im += signal[n] * Math.sin(___);               // TODO
  }
  return 2 / signal.length * Math.hypot(re, im);  // Pythagoras: √(re² + im²)
}`,
  write: `function waveStrength(signal, freq, rate) {
  // TODO: match the signal against cos and sin at freq,
  // then return 2 / N × √(cosTotal² + sinTotal²)
}`,
  sampleTests: [
    { args: [Array.from({ length: 200 }, (_, n) => Math.sin(2 * Math.PI * 10 * n / 200)), 10, 200], expect: 1 },
    { args: [Array.from({ length: 200 }, (_, n) => Math.sin(2 * Math.PI * 10 * n / 200)), 30, 200], expect: 0 },
    { args: [Array.from({ length: 200 }, (_, n) => 0.5 * Math.cos(2 * Math.PI * 10 * n / 200)), 10, 200], expect: 0.5 },
  ],
  // Instant payoff: three light bars driven by YOUR function on a looping beat.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#101B33'; ctx.fillRect(0, 0, W, H);
    const rate = 256, beat = (t / 1000) % 2, bass = 0.5 + 0.5 * Math.cos(Math.PI * beat * 2), mid = 0.5 + 0.5 * Math.sin(t / 700), treble = 0.4 + 0.4 * Math.sin(t / 230);
    const sig = Array.from({ length: rate }, (_, n) => bass * Math.sin(2 * Math.PI * 8 * n / rate) + mid * Math.sin(2 * Math.PI * 40 * n / rate) + treble * Math.sin(2 * Math.PI * 100 * n / rate));
    ctx.font = '700 15px Catamaran, system-ui'; ctx.fillStyle = '#fff'; ctx.fillText('Fest stage lights', 16, 24);
    [['bass 8 Hz', 8, '#C9A21F'], ['mid 40 Hz', 40, '#5EE38F'], ['treble 100 Hz', 100, '#F28B76']].forEach(([l, f, c], i) => {
      const s = fn ? fn(sig, f, rate) : 0; const v = typeof s === 'number' && isFinite(s) ? Math.min(1.2, s) : 0;
      const x = 80 + i * (W - 160) / 3, bw = (W - 220) / 3, hh = v / 1.2 * (H - 110);
      ctx.fillStyle = c; ctx.fillRect(x, H - 40 - hh, bw, hh); ctx.fillStyle = '#fff'; ctx.fillText(l, x, H - 16);
    });
    if (!fn) { ctx.fillStyle = '#F28B76'; ctx.fillText('Write waveStrength to light up the stage', 16, 48); }
  },
};
