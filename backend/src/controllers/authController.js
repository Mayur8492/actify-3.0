const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d',
  });
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If changing email, ensure it's not already used
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error changing password' });
  }
};

const Workspace = require('../models/Workspace');
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const BehaviorPattern = require('../models/BehaviorPattern');

const demoLogin = async (req, res) => {
  try {
    const randomId = Math.random().toString(36).substring(2, 9);
    const email = `demo_${randomId}@actify.com`;
    const password = 'demo_password123';

    // Create Demo User
    const user = await User.create({
      name: 'Guest User',
      email,
      password,
      profession: 'Demo Explorer',
      isDemo: true,
    });

    // Create Workspace
    const workspace = await Workspace.create({
      name: 'My Demo Workspace',
      ownerId: user._id,
      members: [{ userId: user._id, role: 'admin' }],
    });

    // Seed Tasks
    const tasks = [
      { title: 'Explore Dashboard Analytics', priority: 'High', status: 'In Progress' },
      { title: 'Test out Focus Timer', priority: 'Medium', status: 'Pending' },
      { title: 'Try dragging Kanban tasks', priority: 'Low', status: 'Pending' },
      { title: 'Sign up for a real account', priority: 'Critical', status: 'Pending' },
      { title: 'Welcome to Actify!', priority: 'Medium', status: 'Completed' }
    ];

    for (const t of tasks) {
      await Task.create({
        title: t.title,
        workspaceId: workspace._id,
        status: t.status,
        priority: t.priority,
        createdBy: user._id,
        assignedTo: user._id,
      });
    }

    // Seed Habits
    await Habit.create({ title: 'Daily Check-in', workspaceId: workspace._id, createdBy: user._id, streak: 1 });
    await Habit.create({ title: 'Deep Work Session', workspaceId: workspace._id, createdBy: user._id, streak: 3 });

    // Seed Pattern
    await BehaviorPattern.create({
      userId: user._id,
      productivityScore: 85,
      focusScore: 92,
      consistencyScore: 78,
      completedTasks: 1,
    });

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Demo session started',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isDemo: true,
      },
    });
  } catch (error) {
    console.error('Demo Login Error:', error);
    res.status(500).json({ message: 'Server error starting demo session' });
  }
};

module.exports = { signup, login, getMe, updateProfile, changePassword, demoLogin };
