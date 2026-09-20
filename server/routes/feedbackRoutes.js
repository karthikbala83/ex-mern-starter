const router = require('express').Router();
const c = require('../controllers/feedbackController');

// Rate limiting lives in the controller, not here — see the comment there
// for why the database, and not memory, is the right place to count.
router.post('/', c.submit);

module.exports = router;
