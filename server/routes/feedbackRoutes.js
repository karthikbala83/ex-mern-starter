const router = require('express').Router();
// wrapAll: a rejected promise in any handler becomes a 500, not a crash.
const { wrapAll } = require('../middleware/asyncHandler');
const c = wrapAll(require('../controllers/feedbackController'));

// Rate limiting lives in the controller, not here — see the comment there
// for why the database, and not memory, is the right place to count.
router.post('/', c.submit);

module.exports = router;
