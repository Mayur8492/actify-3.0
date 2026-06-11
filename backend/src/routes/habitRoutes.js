const express = require('express');
const router = express.Router();
const { getHabits, createHabit, toggleHabitDate, deleteHabit } = require('../controllers/habitController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.route('/').get(getHabits).post(createHabit);
router.route('/:id/toggle').post(toggleHabitDate);
router.route('/:id').delete(deleteHabit);

module.exports = router;
