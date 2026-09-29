// ---------------------------------------------------------------
// MissionProgress — one row per student per mission.
// This is the "what have I earned" record. It is deliberately small:
// four booleans, three counters. Everything a student can be awarded
// is a flag here, which is what makes "you cannot earn the same
// points twice" a property of the DATA rather than of careful code.
// ---------------------------------------------------------------
const mongoose = require('mongoose');

const missionProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // The catalogue id, e.g. 'moveToward'. A String, not a ref: the mission
    // catalogue is static code, not a collection. Storing it as a ref would
    // mean a join to look up something that never changes at runtime.
    missionId: { type: String, required: true },

    // A stage flips to true the first time it is passed and never flips back.
    // The controller checks the flag BEFORE awarding, so re-passing a stage
    // is allowed (students re-run their code) but pays nothing the second time.
    stages: {
      predict: { type: Boolean, default: false },
      fill: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      bonus: { type: Boolean, default: false },
    },

    points: { type: Number, default: 0 },

    // 0..3, only ever increases. Each hint costs 5 points, and counting them
    // here (not in the browser) is what stops "read all three hints, then
    // reload the page to forget them".
    hintsUsed: { type: Number, default: 0 },

    // Every submission, pass or fail. Used for the first-try bonus.
    attempts: { type: Number, default: 0 },

    firstTryBonus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One row per student per mission; points can't be earned twice.
// The unique index is the real guarantee — two submissions arriving at the
// same instant cannot both create a row and both award points.
missionProgressSchema.index({ user: 1, missionId: 1 }, { unique: true });

module.exports = mongoose.model('MissionProgress', missionProgressSchema);
