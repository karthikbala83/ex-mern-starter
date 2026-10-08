const router = require('express').Router();
// wrapAll: a rejected promise in any handler becomes a 500, not a crash.
const { wrapAll } = require('../middleware/asyncHandler');
const c = wrapAll(require('../controllers/adminController'));
const { adminOnly } = require('../middleware/auth');

router.use(adminOnly);              // everything below is admin-only
router.get('/dashboard', c.dashboard);
router.get('/users', c.listUsers);
router.get('/referral-tree', c.referralTree);   // $graphLookup — recursive join
router.get('/feedback', c.searchFeedback);      // $text search

module.exports = router;
