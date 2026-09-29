// ---------------------------------------------------------------
// Missions — students apply a concept by writing ONE function.
//
// THE RULE, same as Campus Arena: the browser is untrusted.
// The server never accepts "I passed". It:
//   1. picks a secret seed and generates hidden INPUTS from it,
//   2. sends only the inputs — never the expected outputs,
//   3. lets the student's code run in THEIR browser,
//   4. re-creates the same inputs from the stored seed and checks their
//      answers against its own reference implementation.
//
// STUDENT CODE NEVER RUNS ON THIS SERVER. Not with eval, not with Node's
// `vm` module — `vm` is explicitly not a security boundary (a few lines
// reach the host via constructor chains), and one student's infinite loop
// would block the event loop for everybody. Running it in the student's
// own tab means the only machine they can hang is their own.
// ---------------------------------------------------------------
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const MissionProgress = require('../models/MissionProgress');
const MissionAttempt = require('../models/MissionAttempt');
const registry = require('../missions');

const START_SPAM_MS = 2000;   // one attempt at a time, like /api/game/start

// Express 4 does not catch errors thrown inside an async handler, so every
// handler is wrapped rather than each one carrying its own try/catch.
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// ---------------------------------------------------------------
// Mission ids arrive from the URL, so they are user input. Validate
// against the registry BEFORE touching the database — an unknown id is a
// 404, never a query with an attacker-chosen string in it.
// ---------------------------------------------------------------
const getMission = (req, res) => {
  const def = registry[req.params.id];
  if (!def) { res.status(404).json({ message: 'Mission not found' }); return null; }
  return def;
};

// Find-or-create the student's row for this mission. upsert + setOnInsert
// means two rapid submissions cannot both create a row: the unique index
// on { user, missionId } makes the loser of that race find the winner's row.
const getProgress = (userId, missionId) =>
  MissionProgress.findOneAndUpdate(
    { user: userId, missionId },
    { $setOnInsert: { user: userId, missionId } },
    { upsert: true, new: true }
  );

// ---------------------------------------------------------------
// The missions leaderboard. Same two stages as the reaction game, with
// ONE telling difference — look at sortBy.
// ---------------------------------------------------------------
const leaderboardPipeline = (userId) => [
  // Only people who have actually scored. 0 points is not rank 1.
  { $match: { missionPoints: { $gt: 0 } } },

  {
    $setWindowFields: {
      // -1, DESCENDING: more points is better.
      // Compare with the reaction game, which sorts { bestScoreMs: 1 }
      // because a LOWER time is better. Same operator, opposite direction —
      // the sort direction encodes what "winning" means for that metric.
      sortBy: { missionPoints: -1 },
      output: { rank: { $rank: {} } },
    },
  },

  // One round trip, two answers: the top 20 and this student's own row.
  {
    $facet: {
      top: [{ $limit: 20 }, { $project: { _id: 1, name: 1, missionPoints: 1, rank: 1 } }],
      me: [{ $match: { _id: userId } }, { $project: { _id: 0, rank: 1, points: '$missionPoints' } }],
    },
  },
];

const getLeaderboard = async (userId) => {
  const [result] = await User.aggregate(leaderboardPipeline(userId));
  return { top: result.top, me: result.me[0] || null };
};

// ---------------------------------------------------------------
// GET /api/missions/progress
// ---------------------------------------------------------------
exports.progress = ah(async (req, res) => {
  const [rows, board] = await Promise.all([
    MissionProgress.find({ user: req.user._id }).lean(),
    getLeaderboard(req.user._id),
  ]);

  // Keyed by missionId so the client can look a mission up directly
  // instead of scanning an array for every chip it draws.
  const missions = {};
  for (const r of rows) {
    missions[r.missionId] = { stages: r.stages, points: r.points, hintsUsed: r.hintsUsed };
  }

  res.json({ points: req.user.missionPoints || 0, rank: board.me?.rank ?? null, missions });
});

// ---------------------------------------------------------------
// POST /api/missions/:id/predict   { choice }
// A guess before writing code. Cheap, and it makes the student commit to
// an expectation — which is what makes the answer stick.
// ---------------------------------------------------------------
exports.predict = ah(async (req, res) => {
  const def = getMission(req, res); if (!def) return;

  const correct = Number(req.body.choice) === def.predictAnswer;
  const prog = await getProgress(req.user._id, def.id);

  // Points only the first time, and only for a correct answer. Re-answering
  // is free — students should be able to come back and re-read.
  let pointsEarned = 0;
  if (correct && !prog.stages.predict) {
    prog.stages.predict = true;
    pointsEarned = def.points.predict;
    prog.points += pointsEarned;
    await prog.save();
    await User.updateOne({ _id: req.user._id }, { $inc: { missionPoints: pointsEarned } });
  }

  res.json({ correct, points: pointsEarned });
});

// ---------------------------------------------------------------
// POST /api/missions/:id/hint
// Hints are SERVER-side for two reasons: shipping all three to the browser
// would let anyone read them in DevTools for free, and the -5 has to be
// counted somewhere a page reload cannot erase.
// ---------------------------------------------------------------
exports.hint = ah(async (req, res) => {
  const def = getMission(req, res); if (!def) return;

  const prog = await getProgress(req.user._id, def.id);
  if (prog.hintsUsed >= def.hints.length)
    return res.status(400).json({ message: 'No hints left for this mission' });

  const level = prog.hintsUsed;          // 0-based: the next unseen hint
  const cost = def.points.hint;          // negative, e.g. -5

  prog.hintsUsed = level + 1;

  // A mission can never go negative: hints reduce what you earned here, they
  // do not put you in debt. Math.max, not a bare subtraction.
  const before = prog.points;
  prog.points = Math.max(0, before + cost);
  await prog.save();

  // Move the user total by what the mission ACTUALLY lost, not by the sticker
  // price. With 3 points on this mission a -5 hint costs 3, not 5 — taking the
  // full 5 off the total would leave User.missionPoints disagreeing with the
  // sum of the progress rows, and the leaderboard sorts on that total.
  const applied = prog.points - before;
  if (applied) await User.updateOne({ _id: req.user._id }, { $inc: { missionPoints: applied } });

  res.json({ level: level + 1, hint: def.hints[level], points: prog.points });
});

// ---------------------------------------------------------------
// POST /api/missions/:id/start   { stage }
// Step 1 of grading: the server decides the hidden inputs.
// ---------------------------------------------------------------
exports.start = ah(async (req, res) => {
  const def = getMission(req, res); if (!def) return;

  const { stage } = req.body;
  if (!['fill', 'write', 'bonus'].includes(stage))
    return res.status(400).json({ message: 'Stage must be fill, write or bonus' });
  if (stage === 'bonus' && !def.bonusMustUse)
    return res.status(400).json({ message: 'This mission has no bonus stage' });

  // Spam guard, same shape as the game's. Without it a script could open
  // attempts in a loop and fish for a seed whose inputs it already knows.
  const recent = await MissionAttempt.findOne({
    user: req.user._id, status: 'active',
    createdAt: { $gt: new Date(Date.now() - START_SPAM_MS) },
  });
  if (recent) return res.status(429).json({ message: 'Slow down — one attempt at a time.' });

  // crypto.randomInt, not Math.random: this value is the only thing standing
  // between a student and pre-computing the answers, so it must not come
  // from a predictable generator.
  const seed = crypto.randomInt(1, 2 ** 31);
  const attempt = await MissionAttempt.create({ user: req.user._id, missionId: def.id, stage, seed });

  // Inputs go out. Expected outputs stay here. That asymmetry IS the design.
  res.status(201).json({ attemptId: attempt._id, inputs: def.generateInputs(seed) });
});

// ---------------------------------------------------------------
// POST /api/missions/:id/submit   { attemptId, outputs, code }
// Step 4: mark the work.
// ---------------------------------------------------------------
exports.submit = ah(async (req, res) => {
  const def = getMission(req, res); if (!def) return;
  const { attemptId, outputs, code } = req.body;

  // Guard the id before querying: an invalid ObjectId makes Mongoose throw,
  // which would surface as a 500 instead of an honest 404.
  if (!mongoose.isValidObjectId(attemptId))
    return res.status(404).json({ message: 'Attempt not found' });

  // "belongs to this user" is part of the QUERY, not a check afterwards —
  // there is then no moment where we hold someone else's attempt.
  const attempt = await MissionAttempt.findOne({
    _id: attemptId, user: req.user._id, missionId: def.id,
  });
  if (!attempt) return res.status(404).json({ message: 'Attempt not found or expired' });
  if (attempt.status !== 'active')
    return res.status(400).json({ message: 'This attempt was already submitted' });

  // Re-create the exact inputs the student was given. The browser could have
  // sent anything back; this is the only version of the inputs we trust.
  const inputs = def.generateInputs(attempt.seed);
  if (!Array.isArray(outputs) || outputs.length !== inputs.length)
    return res.status(400).json({ message: `Expected ${inputs.length} results, got ${Array.isArray(outputs) ? outputs.length : 0}` });

  attempt.code = typeof code === 'string' ? code.slice(0, 5000) : '';

  const fail = async (payload) => {
    attempt.status = 'failed';
    await attempt.save();
    const prog = await getProgress(req.user._id, def.id);
    prog.attempts += 1;
    await prog.save();
    return res.status(200).json({ passed: false, ...payload });
  };

  // ---- Bonus stage: did they actually use the package? ----
  // A cheap string check, not proof — a student could write the word in a
  // comment. It is a learning nudge, not an exam: the point of the bonus is
  // to discover that a library already solved this.
  if (attempt.stage === 'bonus' && !String(code || '').includes(def.bonusMustUse))
    return fail({ failed: inputs.length, of: inputs.length,
      message: `This bonus needs the package — your code must use ${def.bonusMustUse}` });

  // ---- Mark every case ----
  let failed = 0;
  let example = null;
  for (let i = 0; i < inputs.length; i++) {
    const expected = def.reference(...inputs[i]);
    if (!def.compare(expected, outputs[i])) {
      failed++;
      // Keep only the FIRST failure. One concrete case teaches; ten is a wall
      // of text, and a fresh attempt gets fresh inputs anyway.
      if (!example) example = { input: inputs[i], expected, got: outputs[i] ?? null };
    }
  }

  if (failed) return fail({
    failed, of: inputs.length, example,
    message: 'Close! A hidden test found a case your code misses.',
  });

  // ---- Passed ----
  attempt.status = 'passed';
  await attempt.save();

  const prog = await getProgress(req.user._id, def.id);
  const firstAttempt = prog.attempts === 0 && prog.hintsUsed === 0;
  prog.attempts += 1;

  let pointsEarned = 0;
  // Only award if this stage was not already done — this is what makes
  // "pass write twice" pay once. The flag is the gate, not the attempt count.
  if (!prog.stages[attempt.stage]) {
    prog.stages[attempt.stage] = true;
    pointsEarned += def.points[attempt.stage];

    // First try: no hints read, no earlier submission on this mission at all.
    if (firstAttempt && !prog.firstTryBonus) {
      prog.firstTryBonus = true;
      pointsEarned += def.points.firstTry;
    }
  }

  prog.points = Math.max(0, prog.points + pointsEarned);
  await prog.save();

  // The denormalised total moves in the same write as the progress row.
  if (pointsEarned) await User.updateOne({ _id: req.user._id }, { $inc: { missionPoints: pointsEarned } });

  const board = await getLeaderboard(req.user._id);
  const fresh = await User.findById(req.user._id).select('missionPoints').lean();

  res.json({
    passed: true,
    pointsEarned,
    totalPoints: fresh?.missionPoints ?? 0,
    rank: board.me?.rank ?? null,
  });
});

// ---------------------------------------------------------------
// GET /api/missions/leaderboard
// ---------------------------------------------------------------
exports.leaderboard = ah(async (req, res) => {
  const { top, me } = await getLeaderboard(req.user._id);
  res.json({ top, me });
});
