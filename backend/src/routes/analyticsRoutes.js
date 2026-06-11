const express = require('express');
const { analyzeBehavior, getAnalytics } = require('../controllers/behaviorController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/analyze', analyzeBehavior);
router.get('/', getAnalytics);

module.exports = router;
