// ---------------------------------------------------------------
// Async handlers + Express 4: the bug that takes the whole server down.
//
// Express 4 calls a handler and ignores what it returns. An `async`
// handler returns a Promise; if that Promise REJECTS (a database hiccup,
// a bad ObjectId, `undefined.trim()`), Express never hears about it. The
// request hangs, and Node 15+ treats the unhandled rejection as fatal:
// the process exits and every logged-in student loses the server for the
// 30–60 s Render takes to restart it. One odd request, everyone pays.
//
// The fix is three lines: catch the rejection and pass it to next(), so
// the error handler at the bottom of server.js answers with a 500 like
// any other error. (Express 5 does this by itself; Express 4 does not.)
// ---------------------------------------------------------------
const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Wrap EVERY function a controller exports, so a handler added later is
// protected without anyone having to remember. Used in the routes files:
//   const c = wrapAll(require('../controllers/noteController'));
const wrapAll = (controller) =>
  Object.fromEntries(Object.entries(controller).map(([k, v]) => [k, typeof v === 'function' ? ah(v) : v]));

module.exports = { ah, wrapAll };
