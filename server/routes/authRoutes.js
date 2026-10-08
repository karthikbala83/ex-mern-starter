const router = require('express').Router();
// wrapAll: a rejected promise in any handler becomes a 500, not a crash.
const { wrapAll } = require('../middleware/asyncHandler');
const c = wrapAll(require('../controllers/authController'));
const { protect } = require('../middleware/auth');

router.post('/signup', c.signup);
router.post('/login', c.login);
router.post('/logout', protect, c.logout);
router.post('/forgot-password', c.forgotPassword);
router.post('/reset-password/:token', c.resetPassword);
router.get('/me', protect, c.me);

module.exports = router;
