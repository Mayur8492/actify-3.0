const Activity = require('../models/Activity');

const logActivity = async (userId, action, entityType, entityId, metadata = {}) => {
  try {
    await Activity.create({
      userId,
      action,
      entityType,
      entityId,
      metadata,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20);
    res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
};

module.exports = { logActivity, getRecentActivities };
