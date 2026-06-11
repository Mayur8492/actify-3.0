const User = require('../models/User');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');
const FocusSession = require('../models/FocusSession');
const Activity = require('../models/Activity');
const SystemSetting = require('../models/SystemSetting');

const getOverviewStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    
    // Users created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    // Generate chart data for last 7 days
    const chartData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);
      
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const usersCount = await User.countDocuments({ createdAt: { $gte: start, $lte: end } });
      const tasksCount = await Task.countDocuments({ createdAt: { $gte: start, $lte: end } });
      
      chartData.push({
        name: days[start.getDay()],
        users: usersCount,
        tasks: tasksCount
      });
    }

    res.status(200).json({
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      totalTasks,
      completedTasks,
      chartData,
      averageProductivity: 85, // Placeholder
      averageFocus: 78,        // Placeholder
      averageConsistency: 82   // Placeholder
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overview stats' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const taskQuery = { $or: [{ createdBy: req.params.id }, { assignedTo: req.params.id }] };
    const totalTasks = await Task.countDocuments(taskQuery);
    const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'Completed' });
    const totalSessions = await FocusSession.countDocuments({ userId: req.params.id });

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Focus data for chart (Last 7 days)
    const focusData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let totalDurationLast7Days = 0;
    
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const sessions = await FocusSession.find({
        userId: req.params.id,
        createdAt: { $gte: start, $lte: end }
      });
      
      const dayDurationMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
      const dayDurationHours = dayDurationMinutes / 60;
      totalDurationLast7Days += dayDurationMinutes;

      focusData.push({
        name: days[start.getDay()],
        focus: parseFloat(dayDurationHours.toFixed(1))
      });
    }

    // Sync perfectly with user's actual dashboard data
    const BehaviorPattern = require('../models/BehaviorPattern');
    let pattern = await BehaviorPattern.findOne({ userId: req.params.id });
    if (!pattern) {
      // Fallback if they haven't generated a pattern yet
      pattern = {
        productivityScore: 0,
        focusScore: 0,
        consistencyScore: 0
      };
    }

    const analytics = {
      productivityScore: pattern.productivityScore,
      focusScore: pattern.focusScore,
      consistencyScore: pattern.consistencyScore,
    };

    const taskAnalytics = {
      totalTasks: totalTasks,
      completedTasks: completedTasks,
      pendingTasks: totalTasks - completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };

    res.status(200).json({ user, analytics, taskAnalytics, totalSessions, focusData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot change your own status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user, message: `User status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

const getActivityFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'name email avatar');
    
    res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity feed' });
  }
};

const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.find();
    res.status(200).json({ settings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system settings' });
  }
};

const updateSystemSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await SystemSetting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.status(200).json({ setting });
  } catch (error) {
    res.status(500).json({ message: 'Error updating system setting' });
  }
};

const getReports = async (req, res) => {
  try {
    const users = await User.find().select('_id name email');
    const userStats = [];
    
    const BehaviorPattern = require('../models/BehaviorPattern');

    for (const u of users) {
      const pattern = await BehaviorPattern.findOne({ userId: u._id });
      const score = pattern ? pattern.productivityScore : 0;
      userStats.push({ name: u.name, email: u.email, score });
    }

    userStats.sort((a, b) => b.score - a.score);
    const mostProductiveUsers = userStats.slice(0, 5);

    res.status(200).json({ mostProductiveUsers, allUsers: userStats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
};

const exportReportsCSV = async (req, res) => {
  try {
    const users = await User.find().select('_id name email createdAt status');
    const BehaviorPattern = require('../models/BehaviorPattern');
    
    let csv = 'Name,Email,Status,Joined,Total Tasks,Completed Tasks,Productivity Score\n';
    
    for (const u of users) {
      const taskQuery = { $or: [{ createdBy: u._id }, { assignedTo: u._id }] };
      const totalTasks = await Task.countDocuments(taskQuery);
      const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'Completed' });
      
      const pattern = await BehaviorPattern.findOne({ userId: u._id });
      const score = pattern ? pattern.productivityScore : 0;
      
      csv += `"${u.name}","${u.email}","${u.status}","${new Date(u.createdAt).toISOString().split('T')[0]}","${totalTasks}","${completedTasks}","${score}%"\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=actify_users_report.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting CSV' });
  }
};

const getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalCompletedTasks = await Task.countDocuments({ status: 'Completed' });
    
    // Total Focus Minutes
    const sessions = await FocusSession.find();
    const totalFocusMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);

    res.status(200).json({
      totalUsers,
      totalTasks,
      totalCompletedTasks,
      totalFocusMinutes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};

module.exports = {
  getOverviewStats,
  getUsers,
  getUserDetails,
  updateUserStatus,
  getActivityFeed,
  getSystemSettings,
  updateSystemSetting,
  getReports,
  exportReportsCSV,
  getStatistics
};
