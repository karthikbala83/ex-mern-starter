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
// Bank points: pay any hint debt first, then add the rest to the mission
// row AND the user's total. Returns what actually reached the total.
// Every award goes through here, so "points = earned - hints" holds no
// matter which order a student does things in.
// ---------------------------------------------------------------
//
// The arithmetic happens INSIDE MongoDB, as an update pipeline, in one
// atomic step. Reading the debt first and writing afterwards would let two
// awards arriving together both pay the same debt. ($ifNull: rows saved
// before hintDebt existed simply have no such field.)
const bank = async (progId, userId, amount) => {
  if (amount <= 0) return 0;
  const debt = { $ifNull: ['$hintDebt', 0] };
  const before = await MissionProgress.findOneAndUpdate({ _id: progId }, [
    { $set: { _pay: { $min: [amount, debt] } } },
    { $set: { points: { $add: [{ $ifNull: ['$points', 0] }, { $subtract: [amount, '$_pay'] }] },
              hintDebt: { $subtract: [debt, '$_pay'] } } },
    { $unset: '_pay' },
  ]).lean();                      // returns the row as it was BEFORE this update
  const net = amount - Math.min(amount, before?.hintDebt || 0);
  if (net) await User.updateOne({ _id: userId }, { $inc: { missionPoints: net } });
  return net;
};

// ---------------------------------------------------------------
// POST /api/missions/:id/predict   { choice }
// A guess before writing code. Cheap, and it makes the student commit to
// an expectation — which is what makes the answer stick.
// ---------------------------------------------------------------
exports.predict = ah(async (req, res) => {
  const def = getMission(req, res); if (!def) return;

  const correct = Number(req.body.choice) === def.predictAnswer;
  const prog = await getProgress(req.user._id, def.id);

  // Only the FIRST answer can pay, right or wrong. Re-answering is still
  // allowed (and still says right/wrong) so students can come back and
  // re-read — it just cannot be used to try every option for points.
  //
  // "Claim" in ONE atomic update: the filter only matches while no answer
  // has been recorded, so of 20 parallel requests exactly one matches.
  // Read-then-save would let all 20 see "not answered yet" and all pay.
  const claimed = await MissionProgress.findOneAndUpdate(
    { _id: prog._id, predictAnswered: { $ne: true }, 'stages.predict': { $ne: true } },
    { $set: { predictAnswered: true, ...(correct ? { 'stages.predict': true } : {}) } }
  );
  const pointsEarned = claimed && correct ? await bank(prog._id, req.user._id, def.points.predict) : 0;

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

  await getProgress(req.user._id, def.id);   // make sure the row exists

  // Take the next hint atomically: the filter only matches while hints are
  // left, so parallel clicks cannot unlock hint 4, 5, 6 or pay once for two.
  const prog = await MissionProgress.findOneAndUpdate(
    { user: req.user._id, missionId: def.id, hintsUsed: { $lt: def.hints.length } },
    { $inc: { hintsUsed: 1 } },
    { new: true }
  );
  if (!prog) return res.status(400).json({ message: 'No hints left for this mission' });

  const level = prog.hintsUsed - 1;      // 0-based index of the hint just unlocked
  const cost = -def.points.hint;         // positive, e.g. 5

  // A mission's points never go negative. Whatever this hint cannot take
  // from points you already have becomes debt, paid from your next points
  // (see bank()). The user total moves by what was ACTUALLY taken, so it
  // always equals the sum of the mission rows the leaderboard is built on.
  //
  // Computed inside MongoDB in one atomic step (an update pipeline), NOT
  // read-then-write: three parallel hint clicks on a 10-point mission would
  // each read "10", each take 5, and leave the mission at -5.
  const pts = { $ifNull: ['$points', 0] };
  const before = await MissionProgress.findOneAndUpdate({ _id: prog._id }, [
    { $set: { _take: { $min: [pts, cost] } } },
    { $set: { points: { $subtract: [pts, '$_take'] },
              hintDebt: { $add: [{ $ifNull: ['$hintDebt', 0] }, { $subtract: [cost, '$_take'] }] } } },
    { $unset: '_take' },
  ]).lean();
  const take = Math.min(before.points || 0, cost);
  if (take) await User.updateOne({ _id: req.user._id }, { $inc: { missionPoints: -take } });

  res.json({ level: level + 1, hint: def.hints[level], points: (before.points || 0) - take });
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

  const savedCode = typeof code === 'string' ? code.slice(0, 5000) : '';

  // Close the attempt ATOMICALLY: only a request that finds it still
  // 'active' may mark it. Replaying one passing request 20 times in
  // parallel used to pass the status check above 20 times; now exactly one
  // claim succeeds and the rest are told it was already submitted.
  const claim = (status) => MissionAttempt.findOneAndUpdate(
    { _id: attempt._id, status: 'active' },
    { $set: { status, code: savedCode } }
  );

  const fail = async (payload) => {
    if (!(await claim('failed'))) return res.status(400).json({ message: 'This attempt was already submitted' });
    await getProgress(req.user._id, def.id);
    await MissionProgress.updateOne({ user: req.user._id, missionId: def.id }, { $inc: { attempts: 1 } });
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
  if (!(await claim('passed'))) return res.status(400).json({ message: 'This attempt was already submitted' });

  const prog = await getProgress(req.user._id, def.id);
  const firstAttempt = prog.attempts === 0 && prog.hintsUsed === 0;

  // Award the stage only if THIS update is the one that flips it from
  // false to true: "pass write twice" pays once, even if both passes
  // arrive in the same millisecond. The flag in the filter is the gate.
  const stageKey = 'stages.' + attempt.stage;
  const won = await MissionProgress.findOneAndUpdate(
    { _id: prog._id, [stageKey]: { $ne: true } },
    { $set: { [stageKey]: true }, $inc: { attempts: 1 } }
  );
  if (!won) await MissionProgress.updateOne({ _id: prog._id }, { $inc: { attempts: 1 } });

  let earned = 0;
  if (won) {
    earned += def.points[attempt.stage];
    // First try: no hints read, no earlier submission on this mission at all.
    // Same claim pattern, so the bonus too can only be paid once.
    if (firstAttempt) {
      const first = await MissionProgress.findOneAndUpdate(
        { _id: prog._id, firstTryBonus: { $ne: true } }, { $set: { firstTryBonus: true } });
      if (first) earned += def.points.firstTry;
    }
  }
  // bank() pays any hint debt first and moves the user total in step.
  const pointsEarned = await bank(prog._id, req.user._id, earned);

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
