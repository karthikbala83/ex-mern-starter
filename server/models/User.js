// ---------------------------------------------------------------
// User schema — the "table creation" of MongoDB.
// Lesson: schemas give NoSQL structure — validation, types,
// defaults, indexes, and NESTED JSON (profile) in one document.
// ---------------------------------------------------------------
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
// nanoid@3 is the last CommonJS version — v4+ is ESM-only and `require` would fail.
const { nanoid } = require('nanoid');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,          // creates a unique index — like UNIQUE constraint in SQL
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,         // never returned in queries unless explicitly asked
    },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },

    // ---- NESTED JSON inside a column ----
    // In SQL this would be 3 extra tables. Here it's one sub-document.
    profile: {
      college: { type: String, default: 'Nandha Engineering College' },
      department: { type: String, default: 'CSE' },
      year: { type: Number, min: 1, max: 4, default: 2 },
      skills: [{ type: String }],              // array inside the document
      social: {
        github: String,
        linkedin: String,
      },
    },

    // ================= CAMPUS ARENA fields =================

    // Short shareable invite code. Generated once, pre-save, on create.
    // sparse:true on the index — Mongo would otherwise treat every missing
    // code as the SAME null value and reject the 2nd user with a duplicate-key error.
    referralCode: { type: String, unique: true, index: true, sparse: true },

    // Who invited this user. A ref to our OWN collection (self-reference) —
    // that self-link is exactly what makes $graphLookup able to walk the tree.
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Best (lowest) reaction-game time in milliseconds. null = never played.
    bestScoreMs: { type: Number, default: null },

    // ---- GeoJSON Point. READ THIS TWICE: coordinates are [LONGITUDE, LATITUDE]. ----
    // Every map UI you have ever used says "lat, lng". GeoJSON says the OPPOSITE.
    // Swapping them is the single most common geo bug — you get no error, just
    // results from the wrong side of the planet.
    location: {
      type: { type: String, enum: ['Point'] },   // the weird `type: { type: ... }` is
                                                 // needed because `type` is also a
                                                 // Mongoose keyword. This says: a field
                                                 // literally NAMED "type", of String.
      coordinates: { type: [Number] },           // [lng, lat], rounded to 2 decimals
                                                 // (~1 km) in the controller before save
    },

    lastLoginAt: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }        // adds createdAt / updatedAt automatically
);

// ---- Geospatial index. Without this, $geoNear throws — it is not optional. ----
// '2dsphere' = "index these points on a sphere (Earth)", so distances are real
// metres, not flat-plane maths. sparse:true skips users who never shared location.
userSchema.index({ location: '2dsphere' }, { sparse: true });

// ---- Give every NEW user a referral code. ----
// isNew is true only on the very first save, so codes never change on update.
userSchema.pre('save', function () {
  if (this.isNew && !this.referralCode) this.referralCode = nanoid(8);
});

// ---- Hash password BEFORE saving. Never store plain text. ----
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ---- Instance methods keep logic on the model, not the controller ----
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.createResetToken = function () {
  const raw = crypto.randomBytes(32).toString('hex');
  // store only the HASH of the token — same principle as passwords
  this.resetPasswordToken = crypto.createHash('sha256').update(raw).digest('hex');
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  return raw; // the raw token goes to the user, hash stays in DB
};

module.exports = mongoose.model('User', userSchema);
