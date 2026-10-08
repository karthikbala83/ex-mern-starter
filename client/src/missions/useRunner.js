import { useCallback, useEffect, useRef } from 'react';

// ---------------------------------------------------------------
// useRunner — the main thread's half of the worker.
//
// Its real job is the TIMEOUT. A worker with an infinite loop in it will
// never answer a message and never respond to a polite "please stop" —
// the only thing that stops it is terminate(), which the main thread can
// still call because it is a different thread. That is why this hook
// exists rather than a plain function: someone has to hold the handle and
// pull the plug.
//
// A fresh worker per run, deliberately. Re-using one would be marginally
// faster, but a terminated worker cannot be revived and student code can
// leave globals behind between runs — a clean thread each time means run
// N+1 cannot be affected by whatever run N did.
// ---------------------------------------------------------------
const TIMEOUT_MS = 2000;        // the student's code, once everything is loaded
const LOAD_TIMEOUT_MS = 20000;  // booting the worker + downloading mathjs/geolib

export const TIMEOUT_MESSAGE = 'Your code took too long. Is there a loop that never ends?';

export default function useRunner() {
  const workerRef = useRef(null);

  // If the student navigates away mid-run, kill the thread. Without this a
  // runaway loop keeps a core busy until the tab closes.
  useEffect(() => () => workerRef.current?.terminate(), []);

  const run = useCallback((code, fnName, inputs = [], libs = [], sampleTests = []) =>
    new Promise((resolve) => {
      // new URL(..., import.meta.url) is how Vite finds and bundles a worker.
      // A plain string path works in dev and silently 404s in the build.
      const worker = new Worker(new URL('./runner.worker.js', import.meta.url), { type: 'module' });
      workerRef.current = worker;

      let settled = false;
      const finish = (result) => {
        if (settled) return;            // timeout and reply can race; first one wins
        settled = true;
        clearTimeout(timer);
        worker.terminate();
        workerRef.current = null;
        resolve(result);
      };

      // Two clocks. Until the worker says "ready" it is still booting and
      // loading packages — that is OUR time, and on a slow phone with mobile
      // data it can take several seconds, so it gets a generous limit and an
      // honest message. Only after "ready" does the student's 2 s start.
      let timer = setTimeout(
        () => finish({ ok: false, logs: [], error: 'Could not load what your code needs. Check your internet connection and try again.' }),
        LOAD_TIMEOUT_MS
      );

      worker.onmessage = (e) => {
        if (e.data?.ready) {
          clearTimeout(timer);
          timer = setTimeout(() => finish({ ok: false, logs: [], error: TIMEOUT_MESSAGE }), TIMEOUT_MS);
          return;
        }
        finish(e.data);
      };
      // Fires for an error the worker could not catch itself — a module that
      // fails to load, for instance. Without it the promise would hang forever.
      worker.onerror = (err) => finish({ ok: false, logs: [], error: String(err.message || 'Could not run your code') });

      worker.postMessage({ code, fnName, inputs, sampleTests, libs });
    }), []);

  return run;
}
