const express = require('express');
const { createWorkspace, getWorkspaces, getWorkspaceById, updateWorkspace, deleteWorkspace } = require('../controllers/workspaceController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .post(createWorkspace)
  .get(getWorkspaces);

router.route('/:id')
  .get(getWorkspaceById)
  .put(updateWorkspace)
  .delete(deleteWorkspace);

module.exports = router;
