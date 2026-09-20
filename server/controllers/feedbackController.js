// ---------------------------------------------------------------
// Feedback — submit (rate limited) and, for admins, search.
// We hand-roll the rate limit instead of installing a package:
// once you see it's just "has this user written recently?",
// the middleware stops being magic.
// ---------------------------------------------------------------
const Feedback = require('../models/Feedback');

const ONE_HOUR_MS = 60 * 60 * 1000;

// ---------------------------------------------------------------
// POST /api/feedback   { message, rating }
// ---------------------------------------------------------------
exports.submit = async (req, res) => {
  try {
    // ---- HAND-ROLLED RATE LIMIT ----
    // An in-memory counter (what most rate-limit libraries use) is wrong here:
    // Render runs several instances and restarts them freely, so memory is lost
    // and not shared. The DATABASE is the one thing every instance agrees on,
    // and we already store a createdAt — so the limit needs no new storage at all.
    const since = new Date(Date.now() - ONE_HOUR_MS);
    const recent = await Feedback.findOne({ user: req.user._id, createdAt: { $gte: since } });

    if (recent) {
      const waitMin = Math.ceil((recent.createdAt.getTime() + ONE_HOUR_MS - Date.now()) / 60000);
      return res.status(429).json({
        message: `You already sent feedback. Try again in ${waitMin} minute(s).`,
      });
    }

    await Feedback.create({
      user: req.user._id,
      message: req.body.message,
      rating: req.body.rating,
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    // The client validates too, but this is where a curl request gets caught.
    // Mongoose hands us a readable message — pass it straight through.
    res.status(400).json({ message: err.message });
  }
};
