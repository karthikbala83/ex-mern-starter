// ---------------------------------------------------------------
// runner.worker.js — runs the student's function.
//
// WHY A WORKER AT ALL.
// A Web Worker is a second thread. Student code running here cannot freeze
// the page, so `while (true) {}` costs them a 2-second wait instead of a
// dead tab they have to force-quit. The main thread terminates us on the
// timeout — and terminate() works even mid-infinite-loop, which is the
// whole reason this cannot be done with setTimeout on the main thread.
//
// WHY THIS IS NOT A SANDBOX — read this before trusting it.
// Below, we shadow `fetch`, `XMLHttpRequest`, `importScripts`, `self` and
// `postMessage` by passing them in as undefined parameters. That stops the
// obvious `fetch('...')` by NAME, and nothing more: anyone who wants to get
// round it can, for instance via globalThis or a constructor chain. It is a
// speed bump, not a boundary.
//
// That is acceptable here for one reason only: this code runs in the
// STUDENT'S OWN BROWSER, with their own session, on their own machine.
// There is nothing here to steal that they do not already have. The moment
// you are tempted to run this on the server "just to grade it", re-read
// missionsController.js — grading works precisely because the server never
// runs a line of it.
// ---------------------------------------------------------------

const MAX_LOGS = 50;

// ---------------------------------------------------------------
// Compare a sample result with its expected value.
//
// This MUST use a tolerance, and must match how the server grades, or the
// student gets the worst possible experience: correct code that the
// visible tests call wrong. Concretely, moveToward(0, 0, 180, 5) gives
// y = -6.1e-16 rather than 0, because Math.sin(Math.PI) is not exactly
// zero in any language. JSON.stringify equality marks that ✗.
//
// Same rule as the server's _shared.js close(): numbers within a relative
// tolerance, everything else compared field by field. (Why floats behave
// like this is World 2's lesson — here we just must not punish them for it.)
// ---------------------------------------------------------------
function close(expected, actual, tol = 1e-6) {
  if (typeof expected === 'number') {
    return typeof actual === 'number' && Math.abs(expected - actual) <= tol * Math.max(1, Math.abs(expected));
  }
  if (typeof expected === 'boolean' || typeof expected === 'string') return expected === actual;
  if (Array.isArray(expected)) {
    return Array.isArray(actual) && expected.length === actual.length && expected.every((e, i) => close(e, actual[i], tol));
  }
  if (expected && typeof expected === 'object') {
    return actual && typeof actual === 'object' && Object.keys(expected).every((k) => close(expected[k], actual[k], tol));
  }
  return expected === actual;
}

// Structured clone is what postMessage uses to copy a value between threads,
// and it refuses functions, DOM nodes, symbols and class instances. Checking
// here lets us return the honest "Return plain data" message instead of an
// opaque DataCloneError thrown from deep inside postMessage.
function isPlainData(v, depth = 0) {
  if (depth > 6) return false;                       // stop runaway nesting
  if (v === null || v === undefined) return true;
  const t = typeof v;
  if (t === 'number' || t === 'string' || t === 'boolean') return true;
  if (Array.isArray(v)) return v.every((x) => isPlainData(x, depth + 1));
  if (t === 'object') {
    if (Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) return false;
    return Object.values(v).every((x) => isPlainData(x, depth + 1));
  }
  return false;
}

self.onmessage = async (e) => {
  const { code, fnName, inputs = [], sampleTests = [], libs = [] } = e.data;
  const logs = [];
  const log = (...args) => {
    if (logs.length >= MAX_LOGS) return;             // a loop that prints must not eat all memory
    logs.push(args.map((a) => {
      try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch { return String(a); }
    }).join(' '));
  };

  try {
    // ---- Bonus libraries, loaded ONLY when asked for ----
    // Dynamic import keeps geolib and mathjs out of the main bundle: a
    // student on the fill stage never downloads them.
    let geolib;
    let math;
    if (libs.includes('geolib')) geolib = await import('geolib');
    if (libs.includes('mathjs')) {
      const { create, all } = await import('mathjs');
      math = create(all);
    }

    // Build the student's function. The parameter list is the interesting
    // part: `print`/`console` are things we WANT them to have, and the five
    // undefined ones shadow globals we would rather they did not reach for.
    const factory = new Function(
      'print', 'console', 'geolib', 'math',
      'fetch', 'XMLHttpRequest', 'importScripts', 'self', 'postMessage',
      `${code}\n;return typeof ${fnName} === 'function' ? ${fnName} : null;`
    );

    const fn = factory(
      log, { log, info: log, warn: log, error: log }, geolib, math,
      undefined, undefined, undefined, undefined, undefined
    );

    if (typeof fn !== 'function') {
      return self.postMessage({ ok: false, logs, error: `No function named ${fnName} was found. Did you rename it?` });
    }

    // ---- Visible sample tests: the student sees inputs AND expected ----
    const sampleResults = sampleTests.map((t) => {
      try {
        const got = fn(...t.args);
        return { args: t.args, expect: t.expect, got, pass: close(t.expect, got) };
      } catch (err) {
        return { args: t.args, expect: t.expect, got: String(err.message || err), pass: false };
      }
    });

    // ---- Hidden inputs from the server: we compute outputs, never verdicts ----
    const outputs = [];
    for (const args of inputs) {
      const out = fn(...args);
      if (!isPlainData(out)) {
        return self.postMessage({ ok: false, logs, error: 'Return plain data — numbers, strings, booleans, plain objects or arrays.' });
      }
      outputs.push(out);
    }

    self.postMessage({ ok: true, outputs, sampleResults, logs });
  } catch (err) {
    // A syntax error or a thrown exception is normal while learning, so it
    // comes back as a message to display rather than an unhandled crash.
    self.postMessage({ ok: false, logs, error: String((err && err.message) || err) });
  }
};
