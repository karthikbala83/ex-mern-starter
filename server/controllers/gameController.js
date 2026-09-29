// ---------------------------------------------------------------
// Campus Arena — the reaction game.
// Three lessons live in this file:
//   1. ANTI-CHEAT   — never trust a number the browser sends you.
//   2. $setWindowFields — ranking rows against each OTHER, in the DB.
//   3. $geoNear     — "who is near me", answered by Mongo, not by JS.
// ---------------------------------------------------------------
const mongoose = require('mongoose');
const User = require('../models/User');
const GameSession = require('../models/GameSession');
const Notification = require('../models/Notification');

// ---- Tunable rules of the game, named so the numbers aren't magic ----
const TARGET_COUNT = 10;          // how many dots the player must tap
const START_SPAM_MS = 3000;       // can't start a new game within 3s of the last
const NETWORK_GRACE_MS = 1500;    // allowance for request travel time
const MIN_MS_PER_TAP = 120;       // see comment in finishGame — this is the human limit
const MAX_TOTAL_MS = 60000;       // above a minute it's junk data, not a score
const NEARBY_RADIUS_M = 25000;    // 25 km

// ---------------------------------------------------------------
// The leaderboard pipeline, written ONCE and reused by both
// GET /leaderboard and POST /finish (which must return a fresh rank).
// Duplicating an aggregation is how the two views drift apart.
// ---------------------------------------------------------------
const leaderboardPipeline = (userId) => [
  // Stage 1 — only people who have actually played. A null score is not rank 1.
  { $match: { bestScoreMs: { $ne: null } } },

  // Stage 2 — THE lesson. $setWindowFields looks at a row in the CONTEXT of the
  // other rows. Sort everyone by time ascending, then $rank stamps 1, 2, 3…
  // onto each document. Doing this in JS would mean pulling every user into Node.
  // ($rank leaves gaps on ties: 1, 2, 2, 4 — that is how sport scoreboards work.)
  {
    $setWindowFields: {
      sortBy: { bestScoreMs: 1 },          // 1 = ascending, because FASTER IS BETTER
      output: { rank: { $rank: {} } },
    },
  },

  // Stage 3 — $facet runs several sub-pipelines over the SAME ranked rows,
  // in one round trip. Without it we'd query the database twice for one screen.
  {
    $facet: {
      top: [
        { $limit: 20 },
        { $project: { _id: 1, name: 1, bestScoreMs: 1, rank: 1 } },
      ],
      me: [
        { $match: { _id: userId } },       // my row still carries the rank stamped above
        { $project: { _id: 0, rank: 1, scoreMs: '$bestScoreMs' } },
      ],
    },
  },
];

// Small helper so callers get plain, predictable data.
const getLeaderboard = async (userId) => {
  const [result] = await User.aggregate(leaderboardPipeline(userId));
  return { top: result.top, me: result.me[0] || null };
};

// ---------------------------------------------------------------
// POST /api/game/start
// The client MUST call this before showing the first dot.
// ---------------------------------------------------------------
exports.startGame = async (req, res) => {
  // Spam guard: if this user already opened a game less than 3s ago, refuse.
  // Without it, a script could open thousands of sessions and fish for a
  // lucky elapsed-time window. 429 = "Too Many Requests".
  const recent = await GameSession.findOne({
    user: req.user._id,
    status: 'active',
    startedAt: { $gt: new Date(Date.now() - START_SPAM_MS) },
  });
  if (recent)
    return res.status(429).json({ message: 'Slow down — one game at a time.' });

  // The server stamps startedAt via the schema default. The client never sends a time.
  const session = await GameSession.create({ user: req.user._id });
  res.status(201).json({ gameId: session._id });
};

// ---------------------------------------------------------------
// POST /api/game/finish   { gameId, scoreMs }
// Every check below assumes the client is lying, and proves otherwise.
// ---------------------------------------------------------------
exports.finishGame = async (req, res) => {
  const { gameId, scoreMs } = req.body;

  // Guard the ID before querying: an invalid ObjectId makes Mongoose THROW,
  // which would surface as a 500 instead of an honest 404.
  if (!mongoose.isValidObjectId(gameId))
    return res.status(404).json({ message: 'Game not found' });

  // "belongs to req.user" is part of the QUERY, not an if-statement afterwards.
  // That way there is no window in which we hold someone else's session object.
  const session = await GameSession.findOne({ _id: gameId, user: req.user._id });
  if (!session) return res.status(404).json({ message: 'Game not found or expired' });

  if (session.status !== 'active')
    return res.status(400).json({ message: 'This game was already finished' });

  // Mark the session rejected and send the teaching message.
  const reject = async (reason) => {
    session.status = 'rejected';
    session.finishedAt = new Date();
    session.scoreMs = Number(scoreMs);
    await session.save();
    console.log(`Rejected score from ${req.user.email}: ${scoreMs}ms (${reason})`);
    return res.status(400).json({ message: "Nice try. Server clocks don't lie." });
  };

  const claimed = Number(scoreMs);
  if (!Number.isFinite(claimed)) return reject('not a number');

  // ---- Check 1: physics. How long has the server itself been waiting? ----
  // If the client claims it finished FASTER than the time that actually passed
  // on our clock, the number is fabricated. +1500ms forgives network travel.
  const elapsed = Date.now() - session.startedAt.getTime();
  if (claimed > elapsed + NETWORK_GRACE_MS) return reject('slower than server elapsed');

  // ---- Check 2: biology. 10 taps in under 1200ms = 120ms per tap. ----
  // Documented human visual reaction time bottoms out around 150ms; nobody
  // sustains sub-120ms averages for ten targets. That's a bot, not a student.
  if (claimed < TARGET_COUNT * MIN_MS_PER_TAP) return reject('inhumanly fast');

  // ---- Check 3: junk. Over a minute means a tab left open, not a score. ----
  if (claimed > MAX_TOTAL_MS) return reject('junk data');

  // ---- Accepted ----
  session.status = 'completed';
  session.finishedAt = new Date();
  session.scoreMs = claimed;
  await session.save();

  const oldBest = req.user.bestScoreMs;              // remember before overwriting
  const isPersonalBest = oldBest === null || claimed < oldBest;

  if (isPersonalBest) {
    req.user.bestScoreMs = claimed;
    await req.user.save();

    // ---- Who did I just overtake? ----
    // Anyone whose best is WORSE than my new score but BETTER than my old one
    // has been passed by me. Sorted ascending, the first of them is the player
    // who was sitting immediately above me — the one who'll feel it. Notify only them.
    const passedFilter = { $gt: claimed };
    if (oldBest !== null) passedFilter.$lt = oldBest;  // (if I'd never scored, I passed everyone slower)

    const overtaken = await User.findOne({
      _id: { $ne: req.user._id },
      bestScoreMs: passedFilter,
    }).sort({ bestScoreMs: 1 });

    if (overtaken) {
      await Notification.create({
        user: overtaken._id,
        type: 'BEAT_SCORE',
        message: `${req.user.name} beat your best score with ${claimed}ms!`,
      });
    }
  }

  // Re-run the same ranking pipeline so the number we return is the real one.
  const { me } = await getLeaderboard(req.user._id);

  res.json({
    scoreMs: claimed,
    bestScoreMs: req.user.bestScoreMs,
    isPersonalBest,
    rank: me?.rank ?? null,
  });
};

// ---------------------------------------------------------------
// GET /api/game/leaderboard
// ---------------------------------------------------------------
exports.leaderboard = async (req, res) => {
  const { top, me } = await getLeaderboard(req.user._id);
  res.json({ top, me });
};

// ---------------------------------------------------------------
// GET /api/game/nearby — "players near you", answered by $geoNear.
// ---------------------------------------------------------------
exports.nearby = async (req, res) => {
  // No location saved = nothing to measure from. Say so plainly; the UI
  // turns this 400 into a "share your location" prompt, not an error screen.
  if (!req.user.location?.coordinates?.length)
    return res.status(400).json({ message: 'Share your location first to see nearby players' });

  const players = await User.aggregate([
    {
      // $geoNear MUST be the very first stage of the pipeline — no exceptions.
      // It needs the 2dsphere index to work, and it both FILTERS and SORTS
      // (nearest first) while computing the distance for each document.
      $geoNear: {
        near: { type: 'Point', coordinates: req.user.location.coordinates }, // [lng, lat]!
        distanceField: 'distanceM',        // Mongo writes the distance into this field
        maxDistance: NEARBY_RADIUS_M,      // metres, because the index is spherical
        spherical: true,
        query: { _id: { $ne: req.user._id } },  // exclude myself — I'm 0 km from me
      },
    },
    { $limit: 20 },
    {
      $project: {
        _id: 0,
        name: 1,
        bestScoreMs: 1,
        // metres -> km with 1 decimal: divide, multiply by 10, round, divide by 10.
        // $round alone would give whole km and make everyone look equally far.
        distanceKm: { $divide: [{ $round: [{ $divide: ['$distanceM', 100] }, 0] }, 10] },
      },
    },
  ]);

  res.json({ players });
};
