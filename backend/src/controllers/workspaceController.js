const Workspace = require('../models/Workspace');

const createWorkspace = async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    const workspace = await Workspace.create({
      name,
      ownerId: req.user.id,
      members: [{ userId: req.user.id, role: 'admin' }],
      settings: { isPublic: isPublic || false },
    });
    res.status(201).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: 'Error creating workspace', error: error.message });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [{ ownerId: req.user.id }, { 'members.userId': req.user.id }],
    });
    res.status(200).json({ workspaces });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workspaces' });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('members.userId', 'name email avatar')
      .populate('ownerId', 'name email avatar');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user is a member
    const isMember = workspace.members.some(m => m.userId._id.toString() === req.user.id);
    if (!isMember && !workspace.settings.isPublic && workspace.ownerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workspace' });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found or unauthorized' });
    }
    res.status(200).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: 'Error updating workspace' });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found or unauthorized' });
    }
    res.status(200).json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workspace' });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace
};
