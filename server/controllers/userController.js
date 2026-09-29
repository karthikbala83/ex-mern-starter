// ---------------------------------------------------------------
// User-owned settings: referral code + location sharing.
// Privacy lesson lives in saveLocation — read that comment carefully.
// ---------------------------------------------------------------
const User = require('../models/User');

// ---------------------------------------------------------------
// PUT /api/users/location   { lat, lng }
// ---------------------------------------------------------------
exports.saveLocation = async (req, res) => {
  const lat = Number(req.body.lat);
  const lng = Number(req.body.lng);

  // Validate the RANGE, not just the type. A typo that swaps lat/lng often
  // still parses as a number — checking bounds is what catches it.
  if (!Number.isFinite(lat) || lat < -90 || lat > 90)
    return res.status(400).json({ message: 'Latitude must be between -90 and 90' });
  if (!Number.isFinite(lng) || lng < -180 || lng > 180)
    return res.status(400).json({ message: 'Longitude must be between -180 and 180' });

  // ---- PRIVACY BY DESIGN ----
  // The browser hands us GPS accurate to a few metres — that is someone's
  // desk, hostel room or house. We only need "roughly which part of town",
  // so we throw the precision away HERE, on the server, before it is ever
  // written down. 2 decimals ≈ 1.1 km. You cannot leak what you never stored.
  const round2 = (n) => Math.round(n * 100) / 100;

  req.user.location = {
    type: 'Point',
    coordinates: [round2(lng), round2(lat)],   // LNG FIRST — GeoJSON order, not map order
  };
  await req.user.save();

  res.json({ saved: true });
};

// ---------------------------------------------------------------
// GET /api/users/referral
// ---------------------------------------------------------------
exports.myReferral = async (req, res) => {
  // Older accounts created before this feature existed have no code yet.
  // Backfill lazily instead of running a migration — the pre-save hook
  // on the model does the actual generating.
  if (!req.user.referralCode) await req.user.save();

  // Everyone I invited = everyone whose referredBy points at me.
  // This is the reverse side of the foreign key, and it's why referredBy is
  // stored on the CHILD rather than an array of children on the parent:
  // one indexed lookup, and no document that grows without limit.
  const invited = await User.find({ referredBy: req.user._id })
    .select('name createdAt')
    .sort({ createdAt: -1 });

  res.json({
    code: req.user.referralCode,
    // CLIENT_URL, not the API's own host: the link must open the React app.
    // This is why nothing in this codebase may assume client and server share an origin.
    link: `${process.env.CLIENT_URL}/signup?ref=${req.user.referralCode}`,
    invited: invited.map((u) => ({ name: u.name, joinedAt: u.createdAt })),
    count: invited.length,
  });
};
