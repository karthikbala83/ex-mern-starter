// 🎮 Campus Quest · World 1 · sin & cos (Part A)
export default {
  id: 'moveToward', fnName: 'moveToward', product: 'game', world: 1, lesson: 'sincos-a',
  title: { en: 'Walk in any direction', ta: 'எந்த திசையிலும் நடங்க' },
  story: {
    en: 'In Campus Quest your character can face any angle, not just up, down, left and right. Each frame, the game asks your function: from (x, y), facing angleDeg, taking a step of size speed, where do I land?',
    ta: 'Campus Quest-ல உங்க character எந்த angle-லயும் திரும்பலாம், மேல், கீழ், இடது, வலது மட்டும் இல்ல. ஒவ்வொரு frame-லயும் game உங்க function-கிட்ட கேக்குது: (x, y)-ல இருந்து, angleDeg பக்கம் பார்த்து, speed அளவு அடி வெச்சா, எங்க போய் நிப்பேன்?',
  },
  predict: {
    q: { en: 'Facing 90° (straight up the screen) from (100, 100) with speed 10. Where do you land?', ta: '(100, 100)-ல இருந்து 90° (screen-ல நேரா மேல) பக்கம், speed 10. எங்க போவீங்க?' },
    options: ['(110, 100)', '(100, 90)', '(100, 110)', '(90, 100)'],
  },
  signature: 'moveToward(x, y, angleDeg, speed)',
  fill: `function moveToward(x, y, angleDeg, speed) {
  const rad = angleDeg * Math.PI / 180;     // machines think in radians
  return {
    x: x + speed * Math.___(rad),           // TODO: sideways part
    y: y - speed * Math.sin(rad),           // screen y grows downward
  };
}`,
  write: `function moveToward(x, y, angleDeg, speed) {
  // TODO: return { x, y } after one step.
  // 0° = right, 90° = up. Screen y grows DOWNWARD.
}`,
  sampleTests: [
    { args: [100, 100, 0, 10], expect: { x: 110, y: 100 } },
    { args: [100, 100, 90, 10], expect: { x: 100, y: 90 } },
    { args: [0, 0, 180, 5], expect: { x: -5, y: 0 } },
  ],
  bonus: {
    pkg: 'mathjs', mustUse: 'math.',
    note: { en: 'mathjs understands degrees directly: math.sin(math.unit(angleDeg, "deg")). No manual conversion.', ta: 'mathjs degrees-ஐ நேரடியா புரிஞ்சுக்கும்: math.sin(math.unit(angleDeg, "deg")). Manual conversion வேண்டாம்.' },
    starter: `function moveToward(x, y, angleDeg, speed) {
  const a = math.unit(angleDeg, 'deg');
  // TODO: use math.cos(a) and math.sin(a)
}`,
  },
  // Instant payoff: your character walks a loop around the campus fountain.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#E4EEDC'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#9DB3D6'; ctx.beginPath(); ctx.arc(W / 2, H / 2, 40, 0, 7); ctx.fill();
    ctx.font = '700 14px Catamaran, system-ui'; ctx.fillStyle = '#16294F'; ctx.fillText('fountain', W / 2 - 26, H / 2 + 5);
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.font = '700 16px Catamaran, system-ui'; ctx.fillText('Write moveToward to start walking', 16, 26); return; }
    let p = { x: W / 2 + 110, y: H / 2 }; const steps = Math.floor(t / 16) % 400; ctx.strokeStyle = '#C9A21F'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x, p.y);
    for (let i = 0; i < steps; i++) { const ang = 90 + i * 0.9; p = fn(p.x, p.y, ang, 1.73); ctx.lineTo(p.x, p.y); }
    ctx.stroke(); ctx.fillStyle = '#1E3E7B'; ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, 7); ctx.fill();
  },
};
