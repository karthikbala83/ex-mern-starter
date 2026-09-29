// 🏢 CampusOps · World 1 · Probability
export default {
  id: 'otpBreakChance', fnName: 'otpBreakChance', product: 'app', world: 1, lesson: 'probability',
  title: { en: 'Choose a safe OTP policy', ta: 'பாதுகாப்பான OTP policy-ஐ தேர்ந்தெடுங்க' },
  story: {
    en: 'CampusOps sends an OTP before a student pays fees. The security team must decide: how many digits, and how many wrong tries before locking? Your function tells them the chance that a thief guessing codes gets in.',
    ta: 'Fees கட்டுறதுக்கு முன்னாடி CampusOps ஒரு OTP அனுப்புது. Security team முடிவு பண்ணணும்: எத்தனை digits, lock ஆகுறதுக்கு முன்னாடி எத்தனை தப்பான tries? Codes-ஐ guess பண்ற திருடன் உள்ள போக chance எவ்வளவுன்னு உங்க function சொல்லும்.',
  },
  predict: {
    q: { en: 'A 6-digit OTP, 3 tries allowed. The chance a thief gets in is closest to…', ta: '6-digit OTP, 3 tries. திருடன் உள்ள போக chance கிட்டத்தட்ட…' },
    options: ['3%', '0.3%', '0.0003%', '30%'],
  },
  signature: 'otpBreakChance(digits, attempts)',
  fill: `function otpBreakChance(digits, attempts) {
  const total = 10 ** ___;            // TODO: how many possible codes?
  return Math.min(1, attempts / total);
}`,
  write: `function otpBreakChance(digits, attempts) {
  // TODO: return a number between 0 and 1.
  // A thief tries 'attempts' different codes.
}`,
  sampleTests: [
    { args: [2, 3], expect: 0.03 },
    { args: [4, 5], expect: 0.0005 },
    { args: [1, 20], expect: 1 },
  ],
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, W, H); ctx.font = '700 16px Catamaran, system-ui';
    const rows = [[2, 3], [4, 3], [6, 3]];
    ctx.fillStyle = '#16294F'; ctx.fillText('Thief success chance with 3 tries', 16, 26);
    rows.forEach(([d, a], i) => {
      const v = fn ? fn(d, a) : 0; const y = 60 + i * 60; const w = (W - 200) * Math.min(1, Math.max(0.004, v / 0.03));
      ctx.fillStyle = '#16294F'; ctx.fillText(`${d}-digit OTP`, 16, y + 20);
      ctx.fillStyle = v > 0.001 ? '#C8553D' : '#547B5C'; ctx.fillRect(130, y + 4, w, 24);
      ctx.fillStyle = '#16294F'; ctx.fillText(fn ? `${(v * 100).toPrecision(2)}%` : '?', 140 + w, y + 22);
    });
    ctx.fillStyle = '#56647E'; ctx.fillText('Bar scale: full bar = 3%', 16, H - 12);
  },
};
