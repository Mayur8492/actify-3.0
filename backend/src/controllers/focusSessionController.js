const FocusSession = require('../models/FocusSession');
const { logActivity } = require('./activityController');

const startSession = async (req, res) => {
  try {
    const session = await FocusSession.create({
      userId: req.user.id,
      status: 'Active',
    });
    
    await logActivity(req.user.id, 'Focus Session Started', 'FocusSession', session._id);
    
    res.status(201).json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Error starting session' });
  }
};

const endSession = async (req, res) => {
  try {
    const { duration, interruptions } = req.body;
    
    const session = await FocusSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        status: 'Completed',
        endTime: Date.now(),
        duration,
        interruptions
      },
      { new: true }
    );

    if (!session) return res.status(404).json({ message: 'Session not found' });

    await logActivity(req.user.id, 'Focus Session Ended', 'FocusSession', session._id, { duration, interruptions });

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Error ending session' });
  }
};

module.exports = { startSession, endSession };
