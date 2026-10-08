const router = require('express').Router();
// wrapAll: a rejected promise in any handler becomes a 500, not a crash.
const { wrapAll } = require('../middleware/asyncHandler');
const c = wrapAll(require('../controllers/notificationController'));

router.get('/', c.list);
router.post('/seen', c.markSeen);

module.exports = router;
