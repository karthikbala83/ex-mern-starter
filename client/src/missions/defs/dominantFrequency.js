// 🏢 CampusOps · World 1 · Fourier
const HELPER = `// ✅ PRE-BUILT: how strong is one frequency in the signal? (the matching trick)
// You do not need to change this function.
function waveStrength(signal, freq, rate) {
  let re = 0, im = 0;
  for (let n = 0; n < signal.length; n++) {
    const angle = 2 * Math.PI * freq * n / rate;
    re += signal[n] * Math.cos(angle);
    im += signal[n] * Math.sin(angle);
  }
  return 2 / signal.length * Math.hypot(re, im);
}

`;
export default {
  id: 'dominantFrequency', fnName: 'dominantFrequency', product: 'app', world: 1, lesson: 'fourier',
  title: { en: 'Lab machine health check', ta: 'Lab machine health check' },
  story: {
    en: 'CampusOps monitors the motors in the college workshop. A vibration sensor sends one second of readings. Your function finds the dominant frequency, the strongest one, so the dashboard can tell whether the motor runs at its normal speed.',
    ta: 'CampusOps college workshop-ல இருக்கிற motors-ஐ கண்காணிக்குது. ஒரு vibration sensor ஒரு second readings-ஐ அனுப்புது. உங்க function dominant frequency-ஐ, அதாவது ரொம்ப strong-ஆன ஒண்ணை கண்டுபிடிக்கணும், அப்போ motor சாதாரண வேகத்துல ஓடுதான்னு dashboard சொல்லும்.',
  },
  predict: {
    q: { en: 'A motor runs at 1,500 RPM. Which frequency should dominate its vibration?', ta: 'ஒரு motor 1,500 RPM-ல ஓடுது. அதோட vibration-ல எந்த frequency dominate பண்ணணும்?' },
    options: ['1,500 Hz', '150 Hz', '25 Hz', '60 Hz'],
  },
  signature: 'dominantFrequency(signal, rate, maxFreq)',
  fill: HELPER + `function dominantFrequency(signal, rate, maxFreq) {
  let bestFreq = 1, bestStrength = -1;
  for (let f = 1; f <= maxFreq; f++) {
    const s = waveStrength(signal, f, rate);
    if (s ___ bestStrength) { bestStrength = s; bestFreq = f; }   // TODO: is this one stronger?
  }
  return bestFreq;
}`,
  write: HELPER + `function dominantFrequency(signal, rate, maxFreq) {
  // TODO: try every whole frequency from 1 to maxFreq,
  // and return the one with the largest waveStrength.
}`,
  sampleTests: [
    { args: [Array.from({ length: 200 }, (_, n) => Math.sin(2 * Math.PI * 25 * n / 200)), 200, 99], expect: 25 },
    { args: [Array.from({ length: 200 }, (_, n) => 0.3 * Math.sin(2 * Math.PI * 25 * n / 200) + Math.sin(2 * Math.PI * 60 * n / 200)), 200, 99], expect: 60 },
    { args: [Array.from({ length: 200 }, (_, n) => Math.cos(2 * Math.PI * 7 * n / 200)), 200, 99], expect: 7 },
  ],
  // Instant payoff: the workshop dashboard reads YOUR answer for three motors.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, W, H);
    ctx.font = '700 15px Catamaran, system-ui'; ctx.fillStyle = '#16294F'; ctx.fillText('Workshop motors (normal speed: 25 Hz = 1,500 RPM)', 16, 24);
    const rate = 200, phase = Math.floor(t / 2500) % 3;
    const motors = [['Lathe', 25], ['Drill', phase === 2 ? 40 : 25], ['Pump', 25]];
    motors.forEach(([name, f], i) => {
      let seed = 3 + i; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
      const sig = Array.from({ length: rate }, (_, n) => Math.sin(2 * Math.PI * f * n / rate) + 0.3 * rnd());
      const y = 70 + i * 100; ctx.fillStyle = '#16294F'; ctx.fillText(name, 20, y + 30);
      if (!fn) { ctx.fillStyle = '#A9B7CE'; ctx.fillRect(110, y + 10, W - 140, 34); return; }
      const d = fn(sig, rate, 99); const ok = d === 25;
      ctx.fillStyle = ok ? '#E5EFE7' : '#FBEDEA'; ctx.fillRect(110, y + 10, W - 140, 34);
      ctx.fillStyle = ok ? '#547B5C' : '#C8553D'; ctx.fillText(ok ? `✓ ${d} Hz · normal` : `⚠ ${d} Hz · check this motor`, 124, y + 32);
    });
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write dominantFrequency to read the sensors', 16, 48); }
  },
};
