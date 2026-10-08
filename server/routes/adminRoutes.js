const router = require('express').Router();
// wrapAll: a rejected promise in any handler becomes a 500, not a crash.
const { wrapAll } = require('../middleware/asyncHandler');
const c = wrapAll(require('../controllers/adminController'));
const { adminOnly } = require('../middleware/auth');

router.use(adminOnly);              // everything below is admin-only
router.get('/dashboard', c.dashboard);
router.get('/users', c.listUsers);
router.get('/referral-tree', c.referralTree);   // $graphLookup — recursive join
router.get('/feedback', c.searchFeedback);      // inbox: filters + $text search
router.patch('/feedback/:id', c.updateFeedbackStatus);
router.get('/referral-stats', c.referralStats); // top inviters: $group + $lookup

module.exports = router;
