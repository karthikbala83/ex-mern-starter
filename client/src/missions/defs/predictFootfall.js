// 🏢 CampusOps · World 1 · Polynomials
const HELPER = `// ✅ PRE-BUILT: learns a + b·day + c·day² from history (days 1..n) by least squares.
// You do not need to change this function.
function fitQuadratic(history) {
  const S = (p) => history.reduce((s, _, i) => s + (i + 1) ** p, 0);
  const T = (p) => history.reduce((s, y, i) => s + y * (i + 1) ** p, 0);
  const A = [[S(0), S(1), S(2)], [S(1), S(2), S(3)], [S(2), S(3), S(4)]], B = [T(0), T(1), T(2)];
  for (let c = 0; c < 3; c++) for (let r = c + 1; r < 3; r++) {
    const f = A[r][c] / A[c][c];
    for (let k = c; k < 3; k++) A[r][k] -= f * A[c][k];
    B[r] -= f * B[c];
  }
  const x = [0, 0, 0];
  for (let r = 2; r >= 0; r--) { let s = B[r]; for (let k = r + 1; k < 3; k++) s -= A[r][k] * x[k]; x[r] = s / A[r][r]; }
  return { a: x[0], b: x[1], c: x[2] };
}

`;
export default {
  id: 'predictFootfall', fnName: 'predictFootfall', product: 'app', world: 1, lesson: 'polynomials',
  title: { en: 'Forecast fest footfall', ta: 'Fest footfall-ஐ forecast பண்ணுங்க' },
  story: {
    en: 'The CampusOps fest dashboard plans canteen food and volunteers for tomorrow. The curve-fitting part is already built. Your function uses the fitted curve to predict how many people will come on a given day, in whole people, and never a negative number.',
    ta: 'CampusOps fest dashboard நாளைக்கான canteen சாப்பாடு, volunteers-ஐ plan பண்ணுது. Curve-fitting பகுதி ஏற்கனவே build ஆகியிருக்கு. Fit பண்ண curve-ஐ வெச்சு, ஒரு நாளுக்கு எத்தனை பேர் வருவாங்கன்னு உங்க function predict பண்ணணும், முழு ஆட்களா, negative இல்லாம.',
  },
  predict: {
    q: { en: 'The model is footfall = 250 + 20d + 35d². What does it predict for day 6?', ta: 'Model footfall = 250 + 20d + 35d². Day 6-க்கு என்ன predict பண்ணும்?' },
    options: ['1,630', '1,260', '370', '1,000'],
  },
  signature: 'predictFootfall(history, day)',
  fill: HELPER + `function predictFootfall(history, day) {
  const { a, b, c } = fitQuadratic(history);
  const people = a + b * day + c * ___;          // TODO: the day² term
  return Math.max(0, Math.round(people));        // whole people, never negative
}`,
  write: HELPER + `function predictFootfall(history, day) {
  // TODO: use fitQuadratic(history) to get { a, b, c },
  // predict a + b·day + c·day², round to whole people, never below 0.
}`,
  sampleTests: [
    { args: [[300, 440, 610, 905, 1215], 6], expect: 1615 },
    { args: [[100, 200, 300, 400, 500], 6], expect: 600 },
    { args: [[500, 350, 220, 120, 40], 8], expect: 0 },
  ],
  // Instant payoff: the dashboard chart with YOUR forecast for tomorrow.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, W, H);
    const base = [300, 440, 610, 905, 1215]; const n = 3 + Math.floor((t / 1500) % 3); const hist = base.slice(0, n);
    const ox = 50, oy = H - 50, w = W - 100, X = (d) => ox + d / 7 * w, Y = (v) => oy - v / 2000 * (H - 120);
    ctx.font = '700 15px Catamaran, system-ui'; ctx.fillStyle = '#16294F'; ctx.fillText(`Fest dashboard · data for ${n} days`, 16, 24);
    hist.forEach((v, i) => { ctx.fillStyle = '#9DB3D6'; ctx.fillRect(X(i + 1) - 22, Y(v), 44, oy - Y(v)); ctx.fillStyle = '#16294F'; ctx.fillText(String(v), X(i + 1) - 16, Y(v) - 6); });
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write predictFootfall to forecast tomorrow', 16, 48); return; }
    const p = fn(hist, n + 1); const v = typeof p === 'number' ? p : 0;
    ctx.strokeStyle = '#C9A21F'; ctx.setLineDash([6, 4]); ctx.lineWidth = 3; ctx.strokeRect(X(n + 1) - 22, Y(v), 44, oy - Y(v)); ctx.setLineDash([]);
    ctx.fillStyle = '#7A600A'; ctx.font = '800 17px Catamaran, system-ui'; ctx.fillText(`Tomorrow (day ${n + 1}): ${v} people`, 16, 48);
  },
};
