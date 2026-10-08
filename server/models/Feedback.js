// ---------------------------------------------------------------
// Feedback — students write, admin reads, triages and searches.
// Lesson: validation lives on the MODEL. Whether the message
// arrives from our React form, from Postman, or from a curl one-liner,
// the same minlength/maxlength/min/max rules apply. The browser form
// is a convenience; the schema is the law.
// ---------------------------------------------------------------
const mongoose = require('mongoose');

// What kind of feedback this is. The difference between the two "new
// thing" types is deliberate:
//   idea    — a different way to do something ("teach this with a game")
//   feature — a nice-to-have addition or enhancement ("add dark mode")
// Keeping them apart lets the admin see real bugs and real requests
// without one drowning the other.
const TYPES = ['bug', 'idea', 'feature', 'content', 'other'];
const STATUSES = ['new', 'seen', 'fixed'];

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    type: { type: String, enum: TYPES, default: 'other' },

    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [1000, 'Message must be under 1000 characters'],
      trim: true,
    },

    // Optional now: a bug report does not need a star rating. Older rows
    // all have one, and the 1-5 rule still applies whenever it is given.
    rating: { type: Number, min: [1, 'Rating must be 1-5'], max: [5, 'Rating must be 1-5'] },

    // ---- Context, captured automatically by the client ----
    // "The video stopped" is useless without WHERE and ON WHAT. The form
    // attaches the page, the lesson + step, and the browser's user agent,
    // so the admin never has to ask "which lesson? which phone?".
    page:   { type: String, maxlength: 200, trim: true },
    lesson: { type: String, maxlength: 60, trim: true },
    step:   { type: String, maxlength: 20, trim: true },
    device: { type: String, maxlength: 300, trim: true },

    // Triage, set by the admin: new -> seen -> fixed.
    status: { type: String, enum: STATUSES, default: 'new', index: true },
  },
  { timestamps: true }
);

// ---- TEXT index — Mongo's built-in search engine. ----
// This lets admins run { $text: { $search: 'wifi' } } instead of a slow regex scan.
// Mongo tokenises the message, drops stop-words ("the", "is"), stems words
// ("running" -> "run"), and can rank results by relevance ($meta: 'textScore').
// Limit: ONE text index per collection — so choose the field that matters.
feedbackSchema.index({ message: 'text' });

// The inbox lists newest first, usually filtered by status or type.
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
module.exports.TYPES = TYPES;
module.exports.STATUSES = STATUSES;
