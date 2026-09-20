// ---------------------------------------------------------------
// Notifications — read + mark-as-seen.
// The client polls GET every 10 seconds. Keep both handlers CHEAP:
// a slow query here is a slow query running forever, for every user.
// ---------------------------------------------------------------
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

const MAX_ITEMS = 10;

// ---------------------------------------------------------------
// GET /api/notifications
// ---------------------------------------------------------------
exports.list = async (req, res) => {
  const filter = { user: req.user._id, seen: false };

  // Two cheap queries in PARALLEL rather than one after the other.
  // Promise.all means the round trips overlap instead of stacking up.
  const [items, unseenCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).limit(MAX_ITEMS),
    Notification.countDocuments(filter),
  ]);

  // countDocuments is separate from items.length on purpose: the badge should
  // say "12" even though we only ever ship the newest 10 down the wire.
  res.json({ items, unseenCount });
};

// ---------------------------------------------------------------
// POST /api/notifications/seen   { ids: [] }
// ---------------------------------------------------------------
exports.markSeen = async (req, res) => {
  const ids = (req.body.ids || []).filter((id) => mongoose.isValidObjectId(id));
  if (ids.length === 0) return res.json({ ok: true });   // nothing to do is not an error

  // updateMany = one trip to the database for N rows, instead of N trips.
  // `user: req.user._id` in the filter is the security part: without it, anyone
  // could mark ANYONE's notifications as read by guessing IDs.
  await Notification.updateMany(
    { _id: { $in: ids }, user: req.user._id },
    { $set: { seen: true } }
  );

  res.json({ ok: true });
};
