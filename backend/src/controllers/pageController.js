const Page = require('../models/Page');
const Workspace = require('../models/Workspace');

const createPage = async (req, res) => {
  try {
    const { title, workspaceId, parentPageId, content } = req.body;
    
    // Verify workspace access
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    
    const isMember = workspace.members.some(m => m.userId.toString() === req.user.id) || workspace.ownerId.toString() === req.user.id;
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    const page = await Page.create({
      title,
      workspaceId,
      parentPageId,
      content,
      createdBy: req.user.id,
    });
    res.status(201).json({ page });
  } catch (error) {
    res.status(500).json({ message: 'Error creating page' });
  }
};

const getPages = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) return res.status(400).json({ message: 'Workspace ID required' });

    const pages = await Page.find({ workspaceId }).sort({ createdAt: -1 });
    res.status(200).json({ pages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages' });
  }
};

const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json({ page });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page' });
  }
};

const updatePage = async (req, res) => {
  try {
    const page = await Page.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json({ page });
  } catch (error) {
    res.status(500).json({ message: 'Error updating page' });
  }
};

const deletePage = async (req, res) => {
  try {
    const page = await Page.findOneAndDelete({ _id: req.params.id });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    // Also delete child pages
    await Page.deleteMany({ parentPageId: req.params.id });
    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page' });
  }
};

module.exports = {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage
};
