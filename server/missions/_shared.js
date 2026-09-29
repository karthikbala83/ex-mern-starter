// ---------------------------------------------------------------
// Shared helpers for mission reference files.
// Reference files are SERVER-ONLY: they hold the correct answers,
// the hidden test inputs and the hints. The browser never sees them.
// ---------------------------------------------------------------

// Seeded random numbers: the same seed always gives the same inputs,
// so an attempt can be re-checked later. (mulberry32, a tiny PRNG.)
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const between = (r, lo, hi) => lo + r() * (hi - lo);
const round = (x, d = 4) => Math.round(x * 10 ** d) / 10 ** d;

// Numbers match within a tolerance; objects/arrays match field by field.
// Why a tolerance: 0.1 + 0.2 !== 0.3 in every language. Exact equality on
// floats would fail correct code. (That is World 2's lesson.)
function close(expected, actual, tol = 1e-6) {
  if (typeof expected === 'number') return typeof actual === 'number' && Math.abs(expected - actual) <= tol * Math.max(1, Math.abs(expected));
  if (typeof expected === 'boolean' || typeof expected === 'string') return expected === actual;
  if (Array.isArray(expected)) return Array.isArray(actual) && expected.length === actual.length && expected.every((e, i) => close(e, actual[i], tol));
  if (expected && typeof expected === 'object') return actual && typeof actual === 'object' && Object.keys(expected).every((k) => close(expected[k], actual[k], tol));
  return false;
}

module.exports = { rng, between, round, close };
