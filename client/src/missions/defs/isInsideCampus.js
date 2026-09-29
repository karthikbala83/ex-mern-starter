// 🏢 CampusOps · World 1 · sin & cos (Part B)
export default {
  id: 'isInsideCampus', fnName: 'isInsideCampus', product: 'app', world: 1, lesson: 'sincos-b',
  title: { en: 'Geofenced attendance', ta: 'Geofence attendance' },
  story: {
    en: 'CampusOps lets students mark attendance from their phone, but only when they are really on campus. The phone sends its GPS position. Your function decides: is this student within radiusMetres of the college gate? Field-staff apps in real companies work exactly like this.',
    ta: 'CampusOps-ல students phone-ல இருந்தே attendance போடலாம், ஆனா உண்மையா campus-க்குள்ள இருந்தா மட்டும். Phone GPS position அனுப்புது. இந்த student college gate-ல இருந்து radiusMetres-க்குள்ள இருக்காங்களான்னு உங்க function முடிவு பண்ணுது. Real companies-ல field-staff apps இப்படி தான் வேலை செய்யுது.',
  },
  predict: {
    q: { en: 'A student is 60 m north and 80 m east of the gate. The radius is 150 m. Present?', ta: 'ஒரு student gate-ல இருந்து 60 m வடக்கு, 80 m கிழக்கு. Radius 150 m. Present-ஆ?' },
    options: ['Yes: the distance is 100 m', 'No: 60 + 80 = 140 m is too far', 'No: the distance is 180 m', 'Cannot tell without haversine'],
  },
  signature: 'isInsideCampus(student, gate, radiusMetres)',
  fill: `function isInsideCampus(student, gate, radiusMetres) {
  const north = (student.lat - gate.lat) * 111.2 * 1000;                               // metres
  const east = (student.lng - gate.lng) * 111.2 * 1000 * Math.cos(gate.lat * Math.PI / 180);
  return Math.hypot(north, east) ___ radiusMetres;                                   // TODO: compare
}`,
  write: `function isInsideCampus(student, gate, radiusMetres) {
  // student and gate look like { lat: 11.2892, lng: 77.6073 }
  // TODO: north part, east part (with cos!), Pythagoras, then compare.
}`,
  sampleTests: [
    { args: [{ lat: 11.2892, lng: 77.6073 }, { lat: 11.2892, lng: 77.6073 }, 100], expect: true },
    { args: [{ lat: 11.2900, lng: 77.6073 }, { lat: 11.2892, lng: 77.6073 }, 150], expect: true },
    { args: [{ lat: 11.2930, lng: 77.6073 }, { lat: 11.2892, lng: 77.6073 }, 150], expect: false },
  ],
  bonus: {
    pkg: 'geolib', mustUse: 'geolib.',
    note: { en: 'Real apps use a package. geolib.isPointWithinRadius does the whole job in one line.', ta: 'Real apps package use பண்ணும். geolib.isPointWithinRadius ஒரே line-ல முழு வேலையும் செய்யும்.' },
    starter: `function isInsideCampus(student, gate, radiusMetres) {
  // geolib wants { latitude, longitude }
  return geolib.isPointWithinRadius(
    // TODO
  );
}`,
  },
  // Instant payoff: 24 students around the gate, marked by YOUR function.
  preview(ctx, fn, t, W, H) {
    ctx.fillStyle = '#EEF2EA'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2 + 10, s = 0.9;   // 1 px ≈ 1.1 m
    ctx.strokeStyle = '#1E3E7B'; ctx.setLineDash([8, 6]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 150 * s, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#1E3E7B'; ctx.fillRect(cx - 8, cy - 8, 16, 16); ctx.font = '700 14px Catamaran, system-ui'; ctx.fillText('gate', cx + 12, cy + 5);
    const gate = { lat: 11.2892, lng: 77.6073 }; let present = 0;
    for (let i = 0; i < 24; i++) {
      const d = 20 + ((i * 53) % 230), b = i * 0.9 + t / 4000;
      const dx = d * Math.sin(b), dy = d * Math.cos(b);
      const st = { lat: gate.lat + dy / 111200, lng: gate.lng + dx / (111200 * Math.cos(gate.lat * Math.PI / 180)) };
      const ok = fn ? fn(st, gate, 150) : null; if (ok) present++;
      ctx.fillStyle = ok === null ? '#A9B7CE' : ok ? '#547B5C' : '#C8553D'; ctx.beginPath(); ctx.arc(cx + dx * s, cy - dy * s, 7, 0, 7); ctx.fill();
    }
    ctx.fillStyle = '#16294F'; ctx.font = '700 16px Catamaran, system-ui';
    ctx.fillText(fn ? `Present: ${present} / 24   (radius 150 m)` : 'Write isInsideCampus to mark attendance', 16, 26);
  },
};
