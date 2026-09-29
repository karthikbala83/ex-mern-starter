// trackActivity (protect + heartbeat) is applied in server.js,
// so every handler below already has req.user.
const router = require('express').Router();
const c = require('../controllers/gameController');

router.post('/start', c.startGame);
router.post('/finish', c.finishGame);
router.get('/leaderboard', c.leaderboard);
router.get('/nearby', c.nearby);

module.exports = router;
