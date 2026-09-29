// ---------------------------------------------------------------
// Notification — one row per thing the user should be told about.
// We store them and let the client POLL every 10s (same pattern as
// the admin dashboard). WebSockets would push instead of poll —
// that's the next session. Polling is honest, simple, and works.
// ---------------------------------------------------------------
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // The RECIPIENT — not the person who caused it. Always index the field
    // you filter by, and we filter by "notifications for me" on every poll.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // An enum instead of free text: the client can switch on the type to pick
    // an icon or colour, and a typo can never silently create a new "kind".
    type: { type: String, enum: ['BEAT_SCORE', 'NEW_REFERRAL', 'WELCOME'], required: true },

    message: { type: String, required: true },

    // Indexed because the bell query is {user, seen:false} — a COMPOUND filter.
    seen: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
