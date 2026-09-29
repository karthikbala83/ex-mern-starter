// ---------------------------------------------------------------
// MissionAttempt — the anti-cheat anchor, the same shape as GameSession.
//
// The lesson repeats from Campus Arena: the browser is untrusted. The
// server never accepts "I passed". It picks a secret seed, hands over the
// INPUTS only, and keeps the expected outputs to itself. When the student
// submits, the server re-creates the same inputs from the stored seed and
// checks their answers against its own reference.
//
// So this row is the memory between "start" and "submit": without it the
// server would have no way to know which hidden inputs a set of outputs
// was even answering.
// ---------------------------------------------------------------
const mongoose = require('mongoose');

const missionAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    missionId: { type: String, required: true },
    stage: { type: String, enum: ['fill', 'write', 'bonus'], required: true },

    // Server-chosen, never sent to the browser in a usable form. Re-creates
    // exactly the same hidden inputs at submit time, so we store one number
    // instead of a whole array of test cases.
    seed: { type: Number, required: true },

    status: { type: String, enum: ['active', 'passed', 'failed'], default: 'active' },

    // Kept for the teacher: feedback, and spotting five identical answers.
    code: { type: String, maxlength: 5000 },
  },
  { timestamps: true }
);

// ---- TTL, but only for abandoned attempts. ----
// A student who presses Submit and closes the tab leaves an 'active' row.
// Those self-delete after 30 minutes. Finished attempts (passed/failed) are
// the student's history and a teacher's review material, so they must NOT
// expire — partialFilterExpression is what limits the TTL to active rows.
// A plain TTL index here would quietly delete everyone's work after 30 min.
missionAttemptSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 1800, partialFilterExpression: { status: 'active' } }
);

module.exports = mongoose.model('MissionAttempt', missionAttemptSchema);
