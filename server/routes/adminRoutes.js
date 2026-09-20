const router = require('express').Router();
const c = require('../controllers/adminController');
const { adminOnly } = require('../middleware/auth');

router.use(adminOnly);              // everything below is admin-only
router.get('/dashboard', c.dashboard);
router.get('/users', c.listUsers);
router.get('/referral-tree', c.referralTree);   // $graphLookup — recursive join
router.get('/feedback', c.searchFeedback);      // $text search

module.exports = router;
