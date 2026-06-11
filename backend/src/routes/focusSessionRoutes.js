const express = require('express');
const { startSession, endSession } = require('../controllers/focusSessionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/start', startSession);
router.post('/:id/end', endSession);

module.exports = router;
