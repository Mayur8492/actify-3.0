const BehaviorPattern = require('../models/BehaviorPattern');
const Insight = require('../models/Insight');
const Task = require('../models/Task');
const FocusSession = require('../models/FocusSession');
const Habit = require('../models/Habit');

const calculateAndUpdatePattern = async (userId) => {
  // 1. Productivity Score based on volume of completed tasks, Completion Efficiency based on ratio
  const totalTasks = await Task.countDocuments({ createdBy: userId });
  const completedTasks = await Task.countDocuments({ createdBy: userId, status: 'Completed' });
  const productivityScore = Math.min(100, completedTasks * 10); // 10 tasks = 100%
  const completionEfficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 2. Focus Score based on total session duration instead of average (so short tests don't ruin it)
  const sessions = await FocusSession.find({ userId, status: 'Completed' });
  let focusScore = 0;
  if (sessions.length > 0) {
    const totalDuration = sessions.reduce((acc, s) => acc + s.duration, 0);
    // Arbitrary heuristic: 25 mins (1500s) total = 100% focus.
    let rawFocus = (totalDuration / 1500) * 100;
    const totalInterruptions = sessions.reduce((acc, s) => acc + s.interruptions, 0);
    // Apply a 5% reduction of the CURRENT score per interruption, max 50% reduction
    const penaltyMultiplier = Math.max(0.5, 1 - (totalInterruptions * 0.05));
    rawFocus *= penaltyMultiplier;
    focusScore = Math.max(0, Math.min(100, Math.round(rawFocus)));
  }

  // 3. Consistency and Procrastination
  let consistencyScore = 0;
  let procrastinationScore = 0;
  if (totalTasks > 0 || sessions.length > 0) {
    let avg = Math.round((productivityScore + focusScore) / 2);
    consistencyScore = Math.min(100, isNaN(avg) ? 0 : avg); 
    procrastinationScore = Math.max(0, 100 - consistencyScore); 
  }

  let pattern = await BehaviorPattern.findOne({ userId });
  if (!pattern) {
    pattern = new BehaviorPattern({ userId });
  }

  pattern.productivityScore = productivityScore;
  pattern.focusScore = focusScore;
  pattern.consistencyScore = consistencyScore;
  pattern.procrastinationScore = procrastinationScore;
  pattern.completionEfficiency = completionEfficiency;
  pattern.completedTasks = completedTasks;
  pattern.lastCalculatedAt = Date.now();
  await pattern.save();

  return { pattern, totalTasks, sessions };
};

// Calculate and generate insights
const analyzeBehavior = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pattern, totalTasks, sessions } = await calculateAndUpdatePattern(userId);

    // Generate Insight only if there's activity and not generated recently today
    let newInsight = null;
    if (totalTasks > 0 || sessions.length > 0) {
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);
      const recentInsight = await Insight.findOne({ userId, generatedAt: { $gte: todayStart } });
      
      if (!recentInsight) {
        if (pattern.productivityScore > 80) {
          newInsight = await Insight.create({
            userId,
            message: 'Great job! Your task completion rate is highly efficient this week.',
            type: 'Productivity'
          });
        } else if (pattern.focusScore < 50 && sessions.length > 0) {
          newInsight = await Insight.create({
            userId,
            message: 'Your focus score has dropped. Try using the Pomodoro technique to reduce interruptions.',
            type: 'Focus'
          });
        } else {
          newInsight = await Insight.create({
            userId,
            message: 'You are maintaining a steady work rhythm. Keep it up!',
            type: 'Consistency'
          });
        }
      }
    }

    res.status(200).json({ pattern, newInsight });
  } catch (error) {
    console.error('Error in analyzeBehavior:', error);
    res.status(500).json({ message: 'Error analyzing behavior' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    // Automatically recalculate so dashboard is always up-to-date
    const { pattern } = await calculateAndUpdatePattern(userId);
    const insights = await Insight.find({ userId }).sort({ generatedAt: -1 }).limit(5);
    
    // Fetch completed tasks
    const completedTasks = await Task.find({ createdBy: userId, status: 'Completed' })
      .select('title updatedAt')
      .sort({ updatedAt: -1 })
      .limit(10);

    // Fetch habits with streaks
    const activeHabits = await Habit.find({ createdBy: userId, streak: { $gt: 0 } })
      .select('title streak completedDates');
      
    // Fetch recent focus sessions
    const recentSessions = await FocusSession.find({ userId, status: 'Completed' })
      .select('duration interruptions endTime')
      .sort({ endTime: -1 })
      .limit(10);
    
    // Check if user is completely new (no data)
    const isNew = !pattern || (pattern.productivityScore === 0 && pattern.focusScore === 0 && pattern.consistencyScore === 0);

    // Send back chart data
    // For MVP: Instead of dummy variations, we show flat 0s for previous days and the actual score for today
    // To make it look slightly realistic for the MVP without complex aggregation, we can use 0 for all days, except today.
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    
    const chartData = isNew ? [
      { name: 'Mon', productivity: 0, focus: 0 },
      { name: 'Tue', productivity: 0, focus: 0 },
      { name: 'Wed', productivity: 0, focus: 0 },
      { name: 'Thu', productivity: 0, focus: 0 },
      { name: 'Fri', productivity: 0, focus: 0 },
      { name: 'Sat', productivity: 0, focus: 0 },
      { name: 'Sun', productivity: 0, focus: 0 },
    ] : days.map((day, index) => {
      // Just an MVP representation
      const isTodayOrPast = index <= todayIndex;
      return {
        name: day,
        productivity: index === todayIndex ? pattern.productivityScore : 0,
        focus: index === todayIndex ? pattern.focusScore : 0
      };
    });
    // Reorder so it starts from Monday or aligns properly, but mapping 0-6 is Sun-Sat. 
    // Let's just output Mon-Sun sequentially for simplicity.
    const orderedChartData = [
      { name: 'Mon', productivity: todayIndex === 1 ? pattern.productivityScore : 0, focus: todayIndex === 1 ? pattern.focusScore : 0 },
      { name: 'Tue', productivity: todayIndex === 2 ? pattern.productivityScore : 0, focus: todayIndex === 2 ? pattern.focusScore : 0 },
      { name: 'Wed', productivity: todayIndex === 3 ? pattern.productivityScore : 0, focus: todayIndex === 3 ? pattern.focusScore : 0 },
      { name: 'Thu', productivity: todayIndex === 4 ? pattern.productivityScore : 0, focus: todayIndex === 4 ? pattern.focusScore : 0 },
      { name: 'Fri', productivity: todayIndex === 5 ? pattern.productivityScore : 0, focus: todayIndex === 5 ? pattern.focusScore : 0 },
      { name: 'Sat', productivity: todayIndex === 6 ? pattern.productivityScore : 0, focus: todayIndex === 6 ? pattern.focusScore : 0 },
      { name: 'Sun', productivity: todayIndex === 0 ? pattern.productivityScore : 0, focus: todayIndex === 0 ? pattern.focusScore : 0 },
    ];

    res.status(200).json({ pattern, insights, chartData: orderedChartData, completedTasks, activeHabits, recentSessions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

module.exports = { analyzeBehavior, getAnalytics };
