// trackActivity (protect + heartbeat) is applied in server.js, so every
// handler below already has req.user.
const router = require('express').Router();
const c = require('../controllers/missionsController');

// Static paths BEFORE the /:id ones. Express matches in order, so a route
// like /:id/start declared first would happily treat "leaderboard" as an id.
router.get('/progress', c.progress);
router.get('/leaderboard', c.leaderboard);

router.post('/:id/predict', c.predict);
router.post('/:id/hint', c.hint);
router.post('/:id/start', c.start);
router.post('/:id/submit', c.submit);

module.exports = router;
