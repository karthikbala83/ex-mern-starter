// ---------------------------------------------------------------
// GameSession — the ANTI-CHEAT anchor.
// Rule of the lesson: the browser is an untrusted machine.
// A player can open DevTools and POST any score they like.
// So the server stamps the START time itself, and later checks
// the claimed score against ITS OWN clock. Server clocks don't lie.
// ---------------------------------------------------------------
const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // Stamped by the SERVER, never sent by the client. This is the whole trick.
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: null },

    // active    = started, not yet finished
    // completed = finished and passed every cheat check
    // rejected  = finished but the numbers were impossible
    status: { type: String, enum: ['active', 'completed', 'rejected'], default: 'active' },

    scoreMs: { type: Number, default: null },
  },
  { timestamps: true }
);

// ---- TTL index = Mongo's self-cleaning table. ----
// A player who taps Start and then closes the tab leaves an 'active' row behind.
// Mongo deletes any document 600s (10 min) after its startedAt, automatically,
// with no cron job from us. Set expireAfterSeconds on a Date field and forget it.
gameSessionSchema.index({ startedAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('GameSession', gameSessionSchema);
