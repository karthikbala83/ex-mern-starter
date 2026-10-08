// trackActivity (protect + heartbeat) is applied in server.js
const router = require('express').Router();
// wrapAll: a rejected promise in any handler becomes a 500, not a crash.
const { wrapAll } = require('../middleware/asyncHandler');
const c = wrapAll(require('../controllers/noteController'));

router.route('/').post(c.createNote).get(c.getMyNotes);
router.get('/stats/by-tag', c.myTagStats);
router.route('/:id').get(c.getNote).put(c.updateNote).delete(c.deleteNote);

module.exports = router;
