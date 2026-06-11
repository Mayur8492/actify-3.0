const express = require('express');
const { getRecentActivities } = require('../controllers/activityController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getRecentActivities);

module.exports = router;
