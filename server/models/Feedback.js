// ---------------------------------------------------------------
// Feedback — students write, admin searches.
// Lesson: validation lives on the MODEL. Whether the message
// arrives from our React form, from Postman, or from a curl one-liner,
// the same minlength/maxlength/min/max rules apply. The browser form
// is a convenience; the schema is the law.
// ---------------------------------------------------------------
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [500, 'Message must be under 500 characters'],
      trim: true,
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be 1-5'],
      max: [5, 'Rating must be 1-5'],
    },
  },
  { timestamps: true }
);

// ---- TEXT index — Mongo's built-in search engine. ----
// This lets admins run { $text: { $search: 'wifi' } } instead of a slow regex scan.
// Mongo tokenises the message, drops stop-words ("the", "is"), stems words
// ("running" -> "run"), and can rank results by relevance ($meta: 'textScore').
// Limit: ONE text index per collection — so choose the field that matters.
feedbackSchema.index({ message: 'text' });

module.exports = mongoose.model('Feedback', feedbackSchema);
