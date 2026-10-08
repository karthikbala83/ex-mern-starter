// Settings the logged-in user owns. Note there is no :id anywhere —
// the only user you can edit is the one in your token.
const router = require('express').Router();
// wrapAll: a rejected promise in any handler becomes a 500, not a crash.
const { wrapAll } = require('../middleware/asyncHandler');
const c = wrapAll(require('../controllers/userController'));

router.put('/location', c.saveLocation);
router.get('/referral', c.myReferral);

module.exports = router;
