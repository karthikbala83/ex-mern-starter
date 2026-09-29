// trackActivity (protect + heartbeat) is applied in server.js
const router = require('express').Router();
const c = require('../controllers/lessonFeedbackController');
const { adminOnly } = require('../middleware/auth');

router.get('/questions', c.questions);
router.get('/mine', c.mine);
router.post('/pre', c.submitPre);
router.post('/post', c.submitPost);
router.get('/summary', adminOnly, c.summary);

module.exports = router;
