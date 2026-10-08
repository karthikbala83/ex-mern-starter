// ---------------------------------------------------------------
// Feedback — submit (rate limited). The admin inbox lives in
// adminController.js, behind adminOnly.
// We hand-roll the rate limit instead of installing a package:
// once you see it's just "how many has this user sent recently?",
// the middleware stops being magic.
// ---------------------------------------------------------------
const Feedback = require('../models/Feedback');

const ONE_HOUR_MS = 60 * 60 * 1000;
// 5 an hour, not 1: during a beta a student who hits two bugs in one
// lesson must be able to report both. 5 still stops a script flooding us.
const PER_HOUR = 5;

// Only short strings get through; anything else (an object, a number, a
// 5 MB string) is dropped rather than stored.
const str = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined);

// ---------------------------------------------------------------
// POST /api/feedback   { type, message, rating?, page?, lesson?, step?, device? }
// ---------------------------------------------------------------
exports.submit = async (req, res) => {
  try {
    // ---- HAND-ROLLED RATE LIMIT ----
    // An in-memory counter (what most rate-limit libraries use) is wrong here:
    // Render runs several instances and restarts them freely, so memory is lost
    // and not shared. The DATABASE is the one thing every instance agrees on,
    // and we already store a createdAt — so the limit needs no new storage at all.
    const since = new Date(Date.now() - ONE_HOUR_MS);
    const recent = await Feedback.find({ user: req.user._id, createdAt: { $gte: since } })
      .sort({ createdAt: 1 }).select('createdAt').limit(PER_HOUR).lean();
    if (recent.length >= PER_HOUR) {
      // The oldest of the recent ones decides when a slot frees up.
      const waitMin = Math.ceil((recent[0].createdAt.getTime() + ONE_HOUR_MS - Date.now()) / 60000);
      return res.status(429).json({
        message: `You have sent ${PER_HOUR} in the last hour. Try again in ${waitMin} minute(s).`,
      });
    }

    const { type, message, rating } = req.body;
    // WHITELIST the fields. Passing req.body straight to create() would let
    // a caller set status: 'fixed' or user: <someone else> on their own report.
    await Feedback.create({
      user: req.user._id,
      type: Feedback.TYPES.includes(type) ? type : 'other',
      message: typeof message === 'string' ? message : '',
      rating: rating === undefined || rating === null || rating === 0 ? undefined : Number(rating),
      page: str(req.body.page, 200),
      lesson: str(req.body.lesson, 60),
      step: str(req.body.step, 20),
      device: str(req.body.device, 300),
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    // The client validates too, but this is where a curl request gets caught.
    // A validation error is the student's to fix; anything else is ours.
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    console.error('Feedback submit failed:', err);
    res.status(500).json({ message: 'Could not save your feedback. Please try again.' });
  }
};
