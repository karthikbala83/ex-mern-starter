// ---------------------------------------------------------------
// Feedback schema — one document per student per lesson.
// Lesson: sub-documents (pre, post, rating) keep a whole
// "before → lesson → after" journey inside ONE document.
// ---------------------------------------------------------------
const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema(
  {
    answers: { type: Map, of: Number },   // { q1: 1, q2: 0, q3: 2 }
    score: { type: Number, min: 0 },
    at: Date,
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: String, required: true },            // e.g. 'probability-why'
    version: { type: String, enum: ['A', 'B', 'C'], required: true },
    department: String,                                   // copied from user profile
    year: Number,
    pre: checkSchema,                                     // concept check BEFORE the lesson
    post: checkSchema,                                    // same questions AFTER the lesson
    rating: {
      interest: { type: Number, min: 1, max: 5 },         // "Do you want to learn more?"
      clarity: { type: Number, min: 1, max: 5 },          // "Was it easy to understand?"
      likedMost: String,
      language: { type: String, enum: ['tamil', 'english', 'both'] },
      comment: { type: String, maxlength: 1000, trim: true },
    },
  },
  { timestamps: true }
);

// One attempt per student per lesson (compound unique index)
feedbackSchema.index({ user: 1, lesson: 1 }, { unique: true });
feedbackSchema.index({ lesson: 1, version: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
