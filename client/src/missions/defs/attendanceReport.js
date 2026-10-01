// 🏢 CampusOps · World 1 · Statistics
export default {
  id: 'attendanceReport', fnName: 'attendanceReport', product: 'app', world: 1, lesson: 'statistics',
  title: { en: "The HoD's attendance report", ta: 'HoD-ஓட attendance report' },
  story: {
    en: 'Students need at least 75% attendance to write the semester exam. The HoD wants a one-line summary for each class: mean, median, and how many students are below 75%. Your function produces it for every class in CampusOps.',
    ta: 'Semester exam எழுத students-க்கு குறைஞ்சது 75% attendance வேணும். HoD-க்கு ஒவ்வொரு class-க்கும் ஒரு line summary வேணும்: mean, median, 75%-க்கு கீழ எத்தனை students. உங்க function CampusOps-ல ஒவ்வொரு class-க்கும் அதை உருவாக்கும்.',
  },
  predict: {
    q: { en: 'Attendance: 80, 70, 90, 74, 75. How many students are below 75%?', ta: 'Attendance: 80, 70, 90, 74, 75. 75%-க்கு கீழ எத்தனை students?' },
    options: ['1', '2', '3', '0'],
  },
  signature: 'attendanceReport(percentages)',
  fill: `function attendanceReport(percentages) {
  const mean = percentages.reduce((s, x) => s + x, 0) / percentages.length;
  const s = [...percentages].sort((a, b) => a - b);
  const n = s.length;
  const median = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  const below75 = percentages.filter((p) => p ___ 75).length;   // TODO: is exactly 75 below?
  return { mean, median, below75 };
}`,
  write: `function attendanceReport(percentages) {
  // TODO: return { mean, median, below75 }
  // The rule is "at least 75%": exactly 75 is NOT below.
}`,
  sampleTests: [
    { args: [[80, 70, 90, 74, 75]], expect: { mean: 77.8, median: 75, below75: 2 } },
    { args: [[75, 75, 75]], expect: { mean: 75, median: 75, below75: 0 } },
    { args: [[100, 12, 88]], expect: { mean: 200 / 3, median: 88, below75: 1 } },
  ],
  bonus: {
    pkg: 'mathjs', mustUse: 'math.',
    note: { en: 'mathjs has math.mean and math.median ready-made. You still write the 75% rule yourself: no package knows your college\'s rules.', ta: 'mathjs-ல math.mean, math.median ready-ஆ இருக்கு. 75% rule-ஐ நீங்களே எழுதணும்: உங்க college rules எந்த package-க்கும் தெரியாது.' },
    starter: `function attendanceReport(percentages) {
  // TODO: use math.mean(...) and math.median(...)
  const below75 = percentages.filter((p) => p < 75).length;
  return { mean: 0, median: 0, below75 };
}`,
  },
  // Instant payoff: a class of 60, with YOUR report on top.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, W, H);
    const cls = []; for (let i = 0; i < 60; i++) cls.push(Math.round(62 + 38 * ((i * 37 % 60) / 60) + (i % 7 === 0 ? -20 : 0) + 4 * Math.sin(t / 2000 + i)));
    const ox = 40, oy = H - 40, w = W - 80, X = (v) => ox + (v - 30) / 70 * w;
    ctx.fillStyle = '#16294F'; ctx.font = '700 15px Catamaran, system-ui'; ctx.fillText('CSE-B · 60 students', 16, 24);
    const r = fn ? fn(cls) : null;
    cls.forEach((v, i) => { ctx.beginPath(); ctx.arc(X(v), oy - 20 - (i % 10) * 22, 7, 0, 7); ctx.fillStyle = !r ? '#A9B7CE' : v < 75 ? '#C8553D' : '#547B5C'; ctx.fill(); });
    ctx.strokeStyle = '#C9A21F'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(75), 40); ctx.lineTo(X(75), oy); ctx.stroke();
    ctx.fillStyle = '#7A600A'; ctx.fillText('75% rule', X(75) + 6, 52);
    [40, 60, 80, 100].forEach((v) => { ctx.fillStyle = '#56647E'; ctx.fillText(v + '%', X(v) - 12, oy + 22); });
    ctx.font = '800 17px Catamaran, system-ui';
    if (!r) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write attendanceReport to build the HoD summary', 16, 48); return; }
    ctx.fillStyle = '#16294F'; ctx.fillText(`Mean ${r.mean.toFixed(1)}% · Median ${r.median}% · Below 75%: ${r.below75}`, 16, 48);
  },
};
