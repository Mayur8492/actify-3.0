const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

const createTask = async (req, res) => {
  try {
    const { title, description, workspaceId, status, priority, dueDate, labels, categories, assignedTo } = req.body;
    
    // Verify workspace access
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    
    const task = await Task.create({
      title,
      description,
      workspaceId,
      status,
      priority,
      dueDate,
      labels,
      categories,
      assignedTo,
      createdBy: req.user.id,
    });
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

const getTasks = async (req, res) => {
  try {
    const { workspaceId, status, priority } = req.query;
    let query = {};
    if (workspaceId) query.workspaceId = workspaceId;
    else query.createdBy = req.user.id; // Fallback to user's tasks
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Emit notification if task is marked as completed
    if (req.body.status === 'Completed' || task.status === 'Completed') {
      const Notification = require('../models/Notification');
      const notification = await Notification.create({
        userId: req.user.id,
        message: `You completed task: ${task.title}`,
        type: 'Success'
      });
      const io = req.app.get('io');
      if (io) {
        io.to(req.user.id).emit('new_notification', notification);
      }
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
