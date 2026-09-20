const router = require('express').Router();
const c = require('../controllers/notificationController');

router.get('/', c.list);
router.post('/seen', c.markSeen);

module.exports = router;
