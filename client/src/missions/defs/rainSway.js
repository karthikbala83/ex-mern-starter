// 🎮 Campus Quest · World 1 · sin & cos (Part C)
export default {
  id: 'rainSway', fnName: 'rainSway', product: 'game', world: 1, lesson: 'sincos-c',
  title: { en: 'Make it rain on campus', ta: 'Campus-ல மழை பெய்ய வைங்க' },
  story: {
    en: 'Monsoon has arrived in Campus Quest. The drops already fall with gravity, but they look like robots falling in straight lines. Your function gives each drop a gentle sway in the wind.',
    ta: 'Campus Quest-க்கு monsoon வந்தாச்சு. Drops gravity-ல விழுது, ஆனா straight lines-ல robot மாதிரி இருக்கு. உங்க function ஒவ்வொரு drop-க்கும் wind-ல மெதுவான ஆட்டத்தை கொடுக்கும்.',
  },
  predict: {
    q: { en: 'At time = 0 with phase = 0, how far has a drop swayed from x0?', ta: 'time = 0, phase = 0-ல ஒரு drop x0-ல இருந்து எவ்வளவு ஆடியிருக்கும்?' },
    options: ['Not at all (sin 0 = 0)', 'By the full wind amount', 'By half the wind', 'It depends on gravity'],
  },
  signature: 'rainSway(x0, time, wind, phase)',
  fill: `function rainSway(x0, time, wind, phase) {
  return x0 + wind * Math.___(2 * time + phase);   // TODO: which function makes a wave?
}`,
  write: `function rainSway(x0, time, wind, phase) {
  // TODO: return the drop's x position.
  // It should sway between x0 - wind and x0 + wind like a wave.
}`,
  sampleTests: [
    { args: [200, 0, 30, 0], expect: 200 },
    { args: [200, Math.PI / 4, 30, 0], expect: 230 },
    { args: [100, 1, 0, 1], expect: 100 },
  ],
  preview(ctx, fn, t, W, H) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1A2744'); g.addColorStop(1, '#34507F'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(190,215,255,.8)'; ctx.lineWidth = 2; const time = t / 1000;
    for (let i = 0; i < 90; i++) {
      const x0 = (i * 97) % W, ph = (i * 1.7) % 6.28, y = ((i * 53) + t * (0.18 + (i % 5) * 0.03)) % H;
      const x = fn ? fn(x0, time, 25, ph) : x0; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - (fn ? 3 : 0), y + 16); ctx.stroke();
    }
    ctx.fillStyle = '#fff'; ctx.font = '700 16px Catamaran, system-ui'; ctx.fillText(fn ? 'Wind: sin(2t + phase)' : 'Robot rain. Write rainSway to add wind', 16, 26);
  },
};
