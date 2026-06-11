const Habit = require('../models/Habit');

exports.getHabits = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'workspaceId is required' });
    }
    const habits = await Habit.find({ workspaceId, createdBy: req.user.id });
    res.json({ success: true, data: habits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const { title, workspaceId, frequency, time } = req.body;
    const habit = await Habit.create({
      title,
      workspaceId,
      frequency: frequency || 'Daily',
      time: time || '',
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, data: habit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleHabitDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body; // e.g. "2026-06-10"

    const habit = await Habit.findOne({ _id: id, createdBy: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const index = habit.completedDates.indexOf(date);
    if (index === -1) {
      habit.completedDates.push(date);
    } else {
      habit.completedDates.splice(index, 1);
    }
    
    // Simple streak calculation (just counting total for MVP)
    habit.streak = habit.completedDates.length;

    await habit.save();
    res.json({ success: true, data: habit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!habit) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
