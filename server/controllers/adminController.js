// ---------------------------------------------------------------
// Admin analytics — this is where students move beyond find().
// Every endpoint here is an aggregation pipeline:
//   $match -> $lookup (JOIN) -> $unwind -> $group -> $project
// ---------------------------------------------------------------
const mongoose = require('mongoose');
const User = require('../models/User');
const Note = require('../models/Note');
const Session = require('../models/Session');
const Feedback = require('../models/Feedback');

const ACTIVE_WINDOW_MS = 5 * 60 * 1000; // active = seen in last 5 minutes

// GET /api/admin/dashboard
exports.dashboard = async (req, res) => {
  const since = new Date(Date.now() - ACTIVE_WINDOW_MS);

  // ---- Query 1: live active users (JOIN sessions -> users) ----
  const activeUsers = await Session.aggregate([
    { $match: { lastActiveAt: { $gte: since }, logoutAt: null } },
    {
      $lookup: {                      // SQL: JOIN users ON sessions.user = users._id
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDoc',
      },
    },
    { $unwind: '$userDoc' },
    {
      $group: {                       // a user with 2 tabs = 1 active user
        _id: '$userDoc._id',
        name: { $first: '$userDoc.name' },
        email: { $first: '$userDoc.email' },
        department: { $first: '$userDoc.profile.department' }, // nested JSON field
        lastActiveAt: { $max: '$lastActiveAt' },
        sessions: { $sum: 1 },
      },
    },
    { $sort: { lastActiveAt: -1 } },
  ]);

  // ---- Query 2: logins per day, last 7 days ($group on a date expression) ----
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const loginsPerDay = await Session.aggregate([
    { $match: { loginAt: { $gte: weekAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$loginAt' } },
        logins: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' },
      },
    },
    { $project: { logins: 1, uniqueUsers: { $size: '$uniqueUsers' } } },
    { $sort: { _id: 1 } },
  ]);

  // ---- Query 3: top note-writers (JOIN notes -> users + computed fields) ----
  const topWriters = await Note.aggregate([
    {
      $group: {
        _id: '$user',
        noteCount: { $sum: 1 },
        highPriority: {
          $sum: { $cond: [{ $eq: ['$meta.priority', 'high'] }, 1, 0] }, // conditional count
        },
        lastNoteAt: { $max: '$updatedAt' },
      },
    },
    { $sort: { noteCount: -1 } },
    { $limit: 5 },
    {
      $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'u' },
    },
    { $unwind: '$u' },
    {
      $project: {
        name: '$u.name',
        year: '$u.profile.year',          // reaching into nested JSON
        noteCount: 1,
        highPriority: 1,
        lastNoteAt: 1,
      },
    },
  ]);

  // ---- Simple counts for the stat cards ----
  const [totalUsers, totalNotes, totalSessions] = await Promise.all([
    User.countDocuments(),
    Note.countDocuments(),
    Session.countDocuments(),
  ]);

  res.json({
    counts: { totalUsers, totalNotes, totalSessions, activeNow: activeUsers.length },
    activeUsers,
    loginsPerDay,
    topWriters,
  });
};

// GET /api/admin/users  — paginated user list with note counts (JOIN + facet)
exports.listUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await User.aggregate([
    {
      $lookup: { from: 'notes', localField: '_id', foreignField: 'user', as: 'notes' },
    },
    {
      $project: {
        name: 1,
        email: 1,
        role: 1,
        'profile.department': 1,
        'profile.year': 1,
        'profile.skills': 1,
        noteCount: { $size: '$notes' },
        lastLoginAt: 1,
        createdAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $facet: {                          // pagination + total in ONE round trip
        data: [{ $skip: (page - 1) * limit }, { $limit: Number(limit) }],
        total: [{ $count: 'count' }],
      },
    },
  ]);
  res.json({
    users: result[0].data,
    total: result[0].total[0]?.count || 0,
  });
};

// ---------------------------------------------------------------
// GET /api/admin/referral-tree?userId=
// $graphLookup — the RECURSIVE join. This is the one aggregation
// that plain SQL needs a WITH RECURSIVE CTE to express.
// ---------------------------------------------------------------
exports.referralTree = async (req, res) => {
  // Default to the admin asking, but any user can be the root of a tree.
  const rootId = mongoose.isValidObjectId(req.query.userId)
    ? new mongoose.Types.ObjectId(req.query.userId)
    : req.user._id;

  const [tree] = await User.aggregate([
    { $match: { _id: rootId } },
    {
      // Read this as: "start at me, then repeatedly find every user whose
      // referredBy equals an _id I've already collected, and keep going."
      $graphLookup: {
        from: 'users',              // the collection to walk (raw name, not the model)
        startWith: '$_id',          // the value we begin the search from
        connectFromField: '_id',    // on each new hop, take THIS field of the found doc…
        connectToField: 'referredBy', // …and match it against THIS field to go one level deeper
        as: 'downline',             // every descendant lands in this array
        maxDepth: 4,                // 0 = direct invites only. 4 = five levels. ALWAYS cap it:
                                    // an accidental cycle without maxDepth runs until it dies.
        depthField: 'level',        // Mongo stamps how many hops away each person was
      },
    },
    {
      $project: {
        _id: 0,
        rootName: '$name',
        // level 0 = people I invited directly, 1 = people THEY invited, and so on.
        downline: {
          $map: {
            input: '$downline',
            as: 'd',
            in: { name: '$$d.name', level: '$$d.level' },
          },
        },
      },
    },
  ]);

  if (!tree) return res.status(404).json({ message: 'User not found' });

  // Sort by level so the UI can render a simple indented list, no tree library.
  tree.downline.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  res.json({ ...tree, total: tree.downline.length });
};

// ---------------------------------------------------------------
// GET /api/admin/feedback?q=searchText
// $text search — using the index we declared on the Feedback model.
// ---------------------------------------------------------------
exports.searchFeedback = async (req, res) => {
  const q = (req.query.q || '').trim();

  // No search term: just show the latest 20.
  if (!q) {
    const items = await Feedback.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);
    return res.json({ items, searched: false });
  }

  // With a term, three things change together — and they must ALL be present:
  //   $text   in the filter      -> use the text index
  //   $meta   in the projection  -> ask Mongo for the relevance score
  //   $meta   in the sort        -> order by that score, best match first
  // Sorting by textScore without projecting it is the classic mistake.
  const items = await Feedback.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .populate('user', 'name email')
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);

  res.json({ items, searched: true, q });
};
