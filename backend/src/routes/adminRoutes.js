const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const {
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
} = require('../controllers/adminController');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/overview', getOverviewStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/status', updateUserStatus);
router.get('/activity', getActivityFeed);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSetting);
router.get('/reports', getReports);
router.get('/reports/export', exportReportsCSV);
router.get('/statistics', getStatistics);

module.exports = router;
