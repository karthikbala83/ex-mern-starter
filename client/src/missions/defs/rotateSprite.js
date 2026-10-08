// 🎮 Campus Quest · World 1 · Vectors & matrices
export default {
  id: 'rotateSprite', fnName: 'rotatePoint', product: 'game', world: 1, lesson: 'vectors',
  title: { en: 'Spin the fest windmill', ta: 'Fest windmill-ஐ சுழற்றுங்க' },
  story: {
    en: 'The Campus Quest fest has a windmill whose blades turn all day. Each frame the game asks your function where every corner of a blade goes after rotating around the windmill\'s centre. The rotation matrix does the work.',
    ta: 'Campus Quest fest-ல நாள் முழுக்க சுத்துற ஒரு windmill இருக்கு. ஒவ்வொரு frame-லயும், windmill centre-ஐ சுத்தி சுழன்ற பிறகு ஒரு blade-ஓட ஒவ்வொரு மூலையும் எங்க போகும்னு game உங்க function-கிட்ட கேக்குது. Rotation matrix வேலை செய்யுது.',
  },
  predict: {
    q: { en: 'Rotate (1, 0) around the centre (0, 0) by 90° anticlockwise. Where does it go?', ta: '(1, 0)-ஐ (0, 0) centre-ஐ சுத்தி 90° anticlockwise சுழற்றுங்க. எங்க போகும்?' },
    options: ['(0, 1)', '(1, 1)', '(−1, 0)', '(0, −1)'],
  },
  signature: 'rotatePoint(x, y, cx, cy, angleDeg)',
  fill: `function rotatePoint(x, y, cx, cy, angleDeg) {
  const r = angleDeg * Math.PI / 180;
  const dx = x - cx, dy = y - cy;                       // move the centre to the origin
  return {
    x: cx + dx * Math.cos(r) - dy * Math.___(r),      // TODO: top row of the rotation matrix
    y: cy + dx * Math.sin(r) + dy * Math.cos(r),
  };
}`,
  write: `function rotatePoint(x, y, cx, cy, angleDeg) {
  // TODO: rotate (x, y) around (cx, cy) by angleDeg, anticlockwise.
  // Shift to the origin, apply [[cos, −sin], [sin, cos]], shift back.
}`,
  sampleTests: [
    { args: [1, 0, 0, 0, 90], expect: { x: 0, y: 1 } },
    { args: [5, 3, 3, 3, 180], expect: { x: 1, y: 3 } },
    { args: [2, 2, 1, 1, 0], expect: { x: 2, y: 2 } },
  ],
  bonus: {
    pkg: 'mathjs', mustUse: 'math.',
    note: { en: 'Build the rotation matrix with math.matrix and apply it with math.multiply, the way 3D engines do.', ta: 'math.matrix வெச்சு rotation matrix-ஐ build பண்ணி, math.multiply வெச்சு apply பண்ணுங்க, 3D engines பண்ற மாதிரி.' },
    starter: `function rotatePoint(x, y, cx, cy, angleDeg) {
  const r = angleDeg * Math.PI / 180;
  const R = math.matrix([[Math.cos(r), -Math.sin(r)], [Math.sin(r), Math.cos(r)]]);
  // TODO: const [nx, ny] = math.multiply(R, [x - cx, y - cy]).toArray();
}`,
  },
  // Instant payoff: the windmill turns using YOUR rotatePoint.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#E4EEDC'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2 - 10; ctx.fillStyle = '#8B6B3D'; ctx.fillRect(cx - 10, cy, 20, H - cy - 20);
    ctx.font = '700 15px Catamaran, system-ui'; ctx.fillStyle = '#16294F'; ctx.fillText('Fest windmill', 16, 24);
    const blade = [[0, 0], [110, -14], [125, 0], [110, 14]], ang = (t / 20) % 360;
    for (let k = 0; k < 4; k++) {
      const pts = blade.map(([bx, by]) => { if (!fn) return [cx + bx * Math.cos(k * Math.PI / 2) - by * Math.sin(k * Math.PI / 2), cy - (bx * Math.sin(k * Math.PI / 2) + by * Math.cos(k * Math.PI / 2))]; const q = fn(bx, by, 0, 0, ang + k * 90); return q && isFinite(q.x) ? [cx + q.x, cy - q.y] : [cx, cy]; });
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = ['#C9A21F', '#1E3E7B', '#547B5C', '#C8553D'][k]; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, 7); ctx.fillStyle = '#16294F'; ctx.fill();
    if (!fn) { ctx.fillStyle = '#C8553D'; ctx.fillText('Write rotatePoint to start the windmill', 16, 48); }
  },
};
