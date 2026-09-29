// Settings the logged-in user owns. Note there is no :id anywhere —
// the only user you can edit is the one in your token.
const router = require('express').Router();
const c = require('../controllers/userController');

router.put('/location', c.saveLocation);
router.get('/referral', c.myReferral);

module.exports = router;
