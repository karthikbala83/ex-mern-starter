const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const Notification = require('../models/Notification');
const { primaryClientUrl } = require('../config/clientUrl');

// helper: sign a JWT that carries BOTH user id and session id
const signToken = (userId, sessionId) =>
  jwt.sign({ id: userId, sid: sessionId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

// ---- Only strings may reach a query ----
// req.body is parsed JSON, so "email" can arrive as an OBJECT, e.g.
// {"$gt": ""} — and User.findOne({ email: {"$gt": ""} }) matches the first
// user in the collection. That is NoSQL injection. Checking the type before
// the value goes anywhere near Mongo closes it.
const isStr = (...vals) => vals.every((v) => typeof v === 'string' && v.length > 0 && v.length <= 200);

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, profile, referralCode } = req.body;
    if (!isStr(name, email, password)) return res.status(400).json({ message: 'Name, email and password are required' });
    // The schema lowercases emails on save, so look up the same way —
    // otherwise "Arun@x.com" slips past this check and hits the unique index.
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // ---- Resolve the invite code, if one came along ----
    // A bad or expired code must NEVER block a signup. Someone shared a link in
    // WhatsApp, it got truncated, the code no longer exists — that is not the new
    // student's fault, and losing a real user over a broken link is the worse bug.
    // So: look it up, and if it doesn't resolve, silently carry on with null.
    let referrer = null;
    if (referralCode) {
      referrer = typeof referralCode === 'string' ? await User.findOne({ referralCode: referralCode.trim() }) : null;
    }

    const user = await User.create({
      name,
      email,
      password,
      profile,
      referredBy: referrer ? referrer._id : null,
    });

    // ---- Welcome the new user, and tell the referrer they earned an invite ----
    // insertMany writes both rows in one trip. This runs AFTER the user exists,
    // so a notification can never point at an account that failed to save.
    const welcome = [
      {
        user: user._id,
        type: 'WELCOME',
        message: `Welcome to Campus Arena, ${user.name}! Play a game to get on the leaderboard.`,
      },
    ];
    if (referrer) {
      welcome.push({
        user: referrer._id,
        type: 'NEW_REFERRAL',
        message: `${user.name} joined using your referral link!`,
      });
    }
    await Notification.insertMany(welcome);
    // auto-login after signup: create session + token
    const session = await Session.create({
      user: user._id,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
    const token = signToken(user._id, session._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    // Log it too: the response only reaches the student's browser, so
    // without this line a failed signup leaves nothing in Render's logs.
    // The email (never the password) says WHO hit it; err.name tells a
    // validation error apart from a database problem at a glance.
    console.error(`Signup failed for ${req.body?.email}: [${err.name}] ${err.message}`);
    // Mongoose validation errors come out here — show them to the student
    res.status(400).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!isStr(email, password)) return res.status(400).json({ message: 'Enter your email and password' });
  // password has select:false, so ask for it explicitly
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  user.lastLoginAt = new Date();
  await user.save();

  const session = await Session.create({
    user: user._id,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });
  const token = signToken(user._id, session._id);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// POST /api/auth/logout  (protected)
exports.logout = async (req, res) => {
  await Session.findByIdAndUpdate(req.sessionId, { logoutAt: new Date() });
  res.json({ message: 'Logged out' });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  if (!isStr(req.body.email)) return res.status(400).json({ message: 'Enter your email' });
  const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
  // Always answer the same — don't reveal whether an email exists
  if (!user) return res.json({ message: 'If that email exists, a reset link was sent' });

  const rawToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  // primaryClientUrl, not CLIENT_URL: that may list several origins.
  const resetLink = `${primaryClientUrl}/reset-password/${rawToken}`;
  // PRODUCTION: email this link (nodemailer / SES / Resend).
  // CLASSROOM: we log it + return it so the flow is fully demonstrable.
  console.log('Password reset link:', resetLink);
  const payload = { message: 'If that email exists, a reset link was sent' };
  // OPT-IN, not opt-out: only an explicit NODE_ENV=development hands the
  // link back. The old check (!== 'production') leaked it whenever NODE_ENV
  // was simply forgotten on the host — an account-takeover hole by omission.
  if (process.env.NODE_ENV === 'development') payload.devResetLink = resetLink;
  res.json(payload);
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },   // token must not be expired
  });
  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });
  if (!isStr(req.body.password)) return res.status(400).json({ message: 'Choose a new password' });

  user.password = req.body.password;   // pre-save hook re-hashes it
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Password updated. Please login.' });
};

// GET /api/auth/me  (protected)
exports.me = async (req, res) => {
  // Pick fields: req.user is the whole document, reset-token hash included.
  const { _id, name, email, role, profile, referralCode, missionPoints, bestScoreMs } = req.user;
  res.json({ user: { id: _id, name, email, role, profile, referralCode, missionPoints, bestScoreMs } });
};
