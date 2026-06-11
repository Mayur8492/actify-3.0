const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Task = require('../src/models/Task');
const FocusSession = require('../src/models/FocusSession');
const Habit = require('../src/models/Habit');
const BehaviorPattern = require('../src/models/BehaviorPattern');

async function fixScores() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/actify');
    console.log('Connected to MongoDB');

    const users = await User.find();
    for (const u of users) {
      const tasks = await Task.find({ createdBy: u._id });
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      
      const prodScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      const sessions = await FocusSession.find({ userId: u._id });
      const totalSessions = sessions.length;
      let focusScore = 0;
      if (totalSessions > 0) {
        let penalty = 0;
        sessions.forEach(s => penalty += (s.interruptions || 0) * 5); // 5% penalty per interruption
        focusScore = Math.max(0, 100 - penalty);
      } else {
        focusScore = 0; // if no sessions
      }

      const habits = await Habit.find({ createdBy: u._id });
      let consistScore = 0;
      if (habits.length > 0) {
        let totalStreak = 0;
        habits.forEach(h => totalStreak += (h.streak || 0));
        // max expected streak over 4 weeks ~ 28. Cap consistScore at 100
        consistScore = Math.min(100, (totalStreak / habits.length) * (100 / 14)); 
      }

      await BehaviorPattern.findOneAndUpdate(
        { userId: u._id },
        {
          productivityScore: Math.round(prodScore),
          focusScore: Math.round(focusScore),
          consistencyScore: Math.round(consistScore),
          completedTasks: completedTasks,
          lastCalculatedAt: new Date()
        },
        { upsert: true }
      );
      console.log(`Updated ${u.email}: Prod: ${prodScore.toFixed(1)}, Focus: ${focusScore.toFixed(1)}, Consist: ${consistScore.toFixed(1)}`);
    }

    console.log('Fixed all scores realistically!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixScores();
