// ---------------------------------------------------------------
// Lesson feedback: pre-check → lesson → post-check + rating.
// Scoring happens on the SERVER. Never send answers to the client.
// ---------------------------------------------------------------
const LessonFeedback = require('../models/LessonFeedback');

const LESSON = 'probability-why';

// Lessons now live inside this app (see client/src/lessons).
// A = applications-first story, B = life-first story, C = code lab only.
// The A/B/C pilot is over: Version B is the standard. All three stay in
// this table because answers already saved carry those letters and the
// admin results still group by them — but new students only get B.
const VERSIONS = {
  A: { label: 'Version A', url: '/enovix/probability/watch' },
  B: { label: 'Probability', url: '/enovix/probability/watch' },
  C: { label: 'Version C', url: '/enovix/probability/watch' },
};
const ACTIVE_VERSION = 'B';

// Same 3 questions before and after. Every version covers these ideas.
// "Don't know" is always offered so students don't blind-guess.
const QUESTIONS = [
  {
    id: 'q1',
    text: 'The weather app says "probability of rain = 0.7". What does it mean?',
    options: ['It will rain for 7 hours', 'On 10 days like this, it rains on about 7', 'Rain is 70% impossible', "I don't know"],
    answer: 1,
  },
  {
    id: 'q2',
    text: 'An MCQ has 4 options and you guess without knowing. What is your chance of being right?',
    options: ['1/2 = 50%', '1/4 = 25%', '4/1', "I don't know"],
    answer: 1,
  },
  {
    id: 'q3',
    text: 'Why should a CSE / IT student learn probability?',
    options: [
      'Only to pass the maths exam',
      'Spam filters, recommendations, security and AI are built on it',
      'Coding never needs it',
      "I don't know",
    ],
    answer: 1,
  },
];

const LIKED = ['Everyday examples', 'Animations', 'Tamil narration', 'Predict / guess moments', 'Running the code', 'Quiz'];

const scoreOf = (answers = {}) =>
  QUESTIONS.reduce((s, q) => s + (Number(answers[q.id]) === q.answer ? 1 : 0), 0);

const cleanAnswers = (answers = {}) =>
  Object.fromEntries(QUESTIONS.map((q) => [q.id, Number.isInteger(answers[q.id]) ? answers[q.id] : -1]));

const rating1to5 = (v) => Number.isInteger(v) && v >= 1 && v <= 5;

// Express 4 does not catch async errors — wrap every handler.
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// GET /api/feedback/questions
exports.questions = (req, res) =>
  res.json({
    lesson: LESSON,
    versions: VERSIONS,
    activeVersion: ACTIVE_VERSION,
    liked: LIKED,
    questions: QUESTIONS.map(({ answer, ...q }) => q), // strip answers
  });

// GET /api/feedback/mine  — lets the student resume where they stopped
exports.mine = ah(async (req, res) => {
  const fb = await LessonFeedback.findOne({ user: req.user._id, lesson: LESSON }).lean();
  res.json(fb);
});

// POST /api/feedback/pre   { version, answers }
exports.submitPre = ah(async (req, res) => {
  const { answers } = req.body;
  // Whatever the client sends, a new check is recorded against the one live version.
  const version = ACTIVE_VERSION;

  const exists = await LessonFeedback.findOne({ user: req.user._id, lesson: LESSON });
  if (exists) return res.status(409).json({ message: 'Pre-check already submitted' });

  const a = cleanAnswers(answers);
  const fb = await LessonFeedback.create({
    user: req.user._id,
    lesson: LESSON,
    version,
    department: req.user.profile?.department,
    year: req.user.profile?.year,
    pre: { answers: a, score: scoreOf(a), at: new Date() },
  });
  res.status(201).json(fb);
});

// POST /api/feedback/post  { answers, interest, clarity, likedMost, language, comment }
exports.submitPost = ah(async (req, res) => {
  const fb = await LessonFeedback.findOne({ user: req.user._id, lesson: LESSON });
  if (!fb) return res.status(400).json({ message: 'Do the pre-check first' });
  if (fb.post?.at) return res.status(409).json({ message: 'Feedback already submitted' });

  const { answers, interest, clarity, likedMost, language, comment } = req.body;
  if (!rating1to5(interest) || !rating1to5(clarity))
    return res.status(400).json({ message: 'Please give both ratings (1 to 5)' });

  const a = cleanAnswers(answers);
  fb.post = { answers: a, score: scoreOf(a), at: new Date() };
  fb.rating = {
    interest,
    clarity,
    likedMost: LIKED.includes(likedMost) ? likedMost : undefined,
    language: ['tamil', 'english', 'both'].includes(language) ? language : undefined,
    comment: (comment || '').slice(0, 1000),
  };
  await fb.save();
  res.json(fb);
});

// GET /api/feedback/summary  (admin) — ONE aggregation, three answers via $facet
exports.summary = ah(async (req, res) => {
  const completed = { $ifNull: ['$post.at', false] };
  const [result] = await LessonFeedback.aggregate([
    { $match: { lesson: LESSON } },
    {
      $facet: {
        byVersion: [
          {
            $group: {
              _id: '$version',
              started: { $sum: 1 },
              completed: { $sum: { $cond: [completed, 1, 0] } },
              avgPre: { $avg: '$pre.score' },
              avgPost: { $avg: '$post.score' },
              // gain only for students who finished both checks ($avg skips null)
              avgGain: { $avg: { $cond: [completed, { $subtract: ['$post.score', '$pre.score'] }, null] } },
              avgInterest: { $avg: '$rating.interest' },
              avgClarity: { $avg: '$rating.clarity' },
              wantMore: { $sum: { $cond: [{ $gte: ['$rating.interest', 4] }, 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ],
        likedMost: [
          { $match: { 'rating.likedMost': { $exists: true, $ne: null } } },
          { $group: { _id: { version: '$version', part: '$rating.likedMost' }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        comments: [
          { $match: { 'rating.comment': { $gt: '' } } },
          { $sort: { 'post.at': -1 } },
          { $limit: 40 },
          { $project: { _id: 0, version: 1, department: 1, interest: '$rating.interest', comment: '$rating.comment' } },
        ],
      },
    },
  ]);
  res.json({ ...result, questionCount: QUESTIONS.length });
});
