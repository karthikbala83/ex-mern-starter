// World 1 · sin & cos B · 🏢 CampusOps: geofenced attendance.
// Uses the STEP method from the lesson: north part, east part with cos, Pythagoras.
// Test points are kept well away from the boundary, so the step method and
// packages like geolib always agree (they differ by centimetres at campus scale).
const { rng, close } = require('./_shared');

const KM_PER_DEG = 111.2;

function reference(student, gate, radiusMetres) {
  const north = (student.lat - gate.lat) * KM_PER_DEG * 1000;
  const midLat = (student.lat + gate.lat) / 2;
  const east = (student.lng - gate.lng) * KM_PER_DEG * 1000 * Math.cos(midLat * Math.PI / 180);
  return Math.hypot(north, east) <= radiusMetres;
}

function generateInputs(seed) {
  const R = rng(seed);
  const gate = { lat: 11.2892, lng: 77.6073 };          // a campus gate near Erode
  const cases = [];
  for (let i = 0; i < 10; i++) {
    const radius = [100, 150, 200][i % 3];
    // distance either clearly inside (≤ 70% of radius) or clearly outside (≥ 130%)
    const inside = i % 2 === 0;
    const d = radius * (inside ? 0.1 + R() * 0.6 : 1.3 + R() * 1.5);
    const bearing = R() * 2 * Math.PI;
    const dLat = (d * Math.cos(bearing)) / (KM_PER_DEG * 1000);
    const dLng = (d * Math.sin(bearing)) / (KM_PER_DEG * 1000 * Math.cos(gate.lat * Math.PI / 180));
    cases.push([{ lat: +(gate.lat + dLat).toFixed(6), lng: +(gate.lng + dLng).toFixed(6) }, gate, radius]);
  }
  return cases;
}

module.exports = {
  id: 'isInsideCampus',
  bonusMustUse: 'geolib.',   // bonus stage: code must actually use the package
  fnName: 'isInsideCampus',
  predictAnswer: 0,
  points: { predict: 10, fill: 20, write: 50, bonus: 20, hint: -5, firstTry: 10 },
  reference,
  generateInputs,
  compare: (e, a) => close(e, a),
  hints: [
    { en: 'North distance: difference in latitude × 111.2 km. Remember to work in metres.', ta: 'வடக்கு தூரம்: latitude வித்தியாசம் × 111.2 km. Metres-ல வேலை பண்ணுங்க.' },
    { en: 'East distance: difference in longitude × 111.2 km × cos(latitude). Then Pythagoras: √(north² + east²).', ta: 'கிழக்கு தூரம்: longitude வித்தியாசம் × 111.2 km × cos(latitude). அப்புறம் Pythagoras: √(north² + east²).' },
    { en: 'const north = (student.lat - gate.lat) * 111.2 * 1000;\nconst east = (student.lng - gate.lng) * 111.2 * 1000 * Math.cos(gate.lat * Math.PI / 180);\nreturn Math.hypot(north, east) <= radiusMetres;', ta: 'const north = (student.lat - gate.lat) * 111.2 * 1000;\nconst east = (student.lng - gate.lng) * 111.2 * 1000 * Math.cos(gate.lat * Math.PI / 180);\nreturn Math.hypot(north, east) <= radiusMetres;' },
  ],
};
