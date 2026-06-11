const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Workspace = require('../src/models/Workspace');
const Task = require('../src/models/Task');
const Habit = require('../src/models/Habit');
const FocusSession = require('../src/models/FocusSession');
const Page = require('../src/models/Page');
const Activity = require('../src/models/Activity');
const BehaviorPattern = require('../src/models/BehaviorPattern');
const Insight = require('../src/models/Insight');

const SEED_USERS = [
  { name: 'Rohan Sinha', email: 'rohan@gmail.com', password: 'rohan123', profession: 'Software Engineer', bio: 'Passionate about scalable systems and clean code.', profileProfile: 'RS' },
  { name: 'Priya Sharma', email: 'priya@gmail.com', password: 'priya123', profession: 'Digital Marketer', bio: 'Data-driven marketing strategist.', profileProfile: 'PS' },
  { name: 'Aman Verma', email: 'aman@gmail.com', password: 'aman123', profession: 'MCA Student', bio: 'Aspiring Full Stack Developer exploring web tech.', profileProfile: 'AV' },
  { name: 'Neha Gupta', email: 'neha@gmail.com', password: 'neha123', profession: 'UI/UX Designer', bio: 'Creating beautiful, user-centric experiences.', profileProfile: 'NG' },
  { name: 'Arjun Patel', email: 'arjun@gmail.com', password: 'arjun123', profession: 'Product Manager', bio: 'Bridging the gap between engineering and users.', profileProfile: 'AP' },
  { name: 'Sneha Iyer', email: 'sneha@gmail.com', password: 'sneha123', profession: 'Data Analyst', bio: 'Turning raw data into actionable insights.', profileProfile: 'SI' },
  { name: 'Vivek Singh', email: 'vivek@gmail.com', password: 'vivek123', profession: 'Startup Founder', bio: 'Building the next big thing in SaaS.', profileProfile: 'VS' },
  { name: 'Kavya Nair', email: 'kavya@gmail.com', password: 'kavya123', profession: 'Content Creator', bio: 'Storyteller and video producer.', profileProfile: 'KN' },
  { name: 'Rahul Mehta', email: 'rahul@gmail.com', password: 'rahul123', profession: 'MBA Student', bio: 'Specializing in finance and operations.', profileProfile: 'RM' },
  { name: 'Ananya Das', email: 'ananya@gmail.com', password: 'ananya123', profession: 'Freelancer', bio: 'Independent writer and editor.', profileProfile: 'AD' },
];

const TASK_POOLS = {
  'Software Engineer': ['Complete API integration', 'Fix authentication bug', 'Write unit tests', 'Optimize queries', 'Setup CI/CD pipeline', 'Code review', 'Update documentation', 'Refactor legacy code', 'Debug memory leak', 'Deploy to staging', 'Plan architecture', 'Fix CSS issues', 'Write migration script', 'Monitor server logs', 'Sync with frontend team'],
  'Digital Marketer': ['Schedule campaign', 'Analyze CTR report', 'Create ad creatives', 'Draft newsletter', 'A/B testing', 'Keyword research', 'Update SEO meta tags', 'Review analytics', 'Write blog post', 'Social media planning', 'Influencer outreach', 'Check ad spend', 'Setup tracking pixels', 'Competitor analysis', 'Client meeting'],
  'MCA Student': ['Complete DBMS assignment', 'Study Operating Systems', 'Revise DSA concepts', 'Prepare project doc', 'Attend online lecture', 'Solve LeetCode problems', 'Work on final year project', 'Prepare for viva', 'Submit practical file', 'Read research paper', 'Group study session', 'Mock interview practice', 'Write python script', 'Learn React.js', 'Update resume'],
  'UI/UX Designer': ['Create wireframes', 'Design landing page', 'User research', 'Prototyping in Figma', 'Design system update', 'Feedback session', 'Export assets', 'Review typography', 'Create custom icons', 'Accessibility check', 'Handover to devs', 'Client presentation', 'Color palette selection', 'Usability testing', 'Update portfolio'],
  'Product Manager': ['Write PRD', 'Sprint planning', 'Backlog grooming', 'Stakeholder meeting', 'Review metrics', 'User interviews', 'Roadmap update', 'Market research', 'Analyze churn rate', 'Draft release notes', 'Prioritize features', 'Sync with engineering', 'Sync with design', 'Competitor feature check', 'Prepare Q3 presentation'],
  'Data Analyst': ['Clean dataset', 'Write SQL queries', 'Create Tableau dashboard', 'A/B test analysis', 'Weekly reporting', 'Data pipeline check', 'Export data to CSV', 'Trend analysis', 'Predictive modeling', 'Update ETL scripts', 'Sync with data engineers', 'Present findings', 'Anomaly detection', 'Fix broken dashboard', 'Review data governance'],
  'Startup Founder': ['Pitch deck revision', 'Investor meeting', 'Review financials', 'Hiring interviews', 'Product strategy sync', 'Draft company vision', 'Marketing budget review', 'Legal compliance check', 'Customer calls', 'Partnership discussion', 'Write company update', 'Review user feedback', 'Team all-hands', 'Analyze CAC/LTV', 'Plan next quarter goals'],
  'Content Creator': ['Script writing', 'Shoot video', 'Edit footage', 'Design thumbnail', 'SEO for YouTube', 'Engage with comments', 'Plan content calendar', 'Brand deal negotiation', 'Record voiceover', 'Color grading', 'Publish blog post', 'Instagram reel editing', 'Analyze audience retention', 'Research trending topics', 'Update media kit'],
  'MBA Student': ['Case study analysis', 'Prepare presentation', 'Group project meeting', 'Finance assignment', 'Read Harvard Business Review', 'Networking event', 'Mock consulting interview', 'Marketing strategy paper', 'Operations management quiz', 'Revise accounting principles', 'Attend guest lecture', 'Submit thesis draft', 'Update LinkedIn', 'Excel modeling practice', 'Corporate strategy reading'],
  'Freelancer': ['Send invoices', 'Client onboarding', 'Draft proposal', 'Tax filing', 'Update portfolio website', 'Follow up on leads', 'Write article draft', 'Revisions for client', 'Networking on LinkedIn', 'Reply to emails', 'Plan monthly budget', 'Learn new skill', 'Sign contract', 'Schedule social posts', 'Client video call']
};

const HABIT_POOL = ['Morning Exercise', 'Reading Books', 'Daily Planning', 'Meditation', 'Deep Work Session', 'Learning New Skills', 'Journal Writing', 'Reviewing Goals', 'Walking After Lunch', 'No Social Media Before Noon', 'Drink 2L Water', 'Healthy Breakfast', 'Stretching', 'Learn a language', 'Gratitude log'];

const PAGE_CONTENTS = {
  'Software Engineer': ['# Backend Architecture\n\nNotes on scaling our Node.js microservices...', '# Sprint Planning\n\nGoals for this week:\n- Fix auth\n- Deploy to prod', '# API Documentation\n\nEndpoints:\n- `/api/users`\n- `/api/tasks`', '# MongoDB Optimization\n\nAdd indexes to `assignedTo` field for faster queries...', '# Authentication Flow\n\nUsing JWT with HttpOnly cookies...', '# Project Roadmap\n\nQ3: Features X, Y, Z...', '# Bug Tracking\n\nTicket #1244 is still open...', '# Deployment Checklist\n\n- Run tests\n- Build assets\n- Deploy'],
  'MCA Student': ['# Semester Goals\n\nMaintain 9.0 CGPA...', '# MCA Project Plan\n\nBuilding a task management app...', '# DSA Notes\n\nTrees and Graphs are important...', '# DBMS Revision\n\nNormalization forms: 1NF, 2NF, 3NF, BCNF...', '# Placement Preparation\n\nFocus on technical rounds...', '# Interview Questions\n\n- Explain OOP concepts\n- What is REST?', '# Study Schedule\n\nMorning: DSA. Evening: Web Dev.', '# Career Roadmap\n\nTargeting SDE roles in top tech companies...'],
  // Default pages for others to save space
  'Default': ['# Weekly Goals\n\nFocus on priority tasks...', '# Meeting Notes\n\nAction items from sync...', '# Project Ideas\n\n1. App X\n2. Service Y', '# Learning Log\n\nCompleted chapter 3 today...', '# Useful Resources\n\nLinks to tutorials and docs...', '# Important Contacts\n\nEmails and phone numbers...', '# Draft Ideas\n\nNeeds more thought...', '# Quarter Review\n\nThings went well, need to improve consistency...']
};

const INSIGHTS = [
  { type: 'Productivity', message: 'You perform best between 8 PM and 10 PM.' },
  { type: 'Consistency', message: 'Your task completion rate improves after planning sessions.' },
  { type: 'Procrastination', message: 'You frequently delay low-priority tasks.' },
  { type: 'Focus', message: 'Long focus sessions improve your productivity score.' },
  { type: 'Recommendation', message: 'Try breaking down complex tasks into smaller chunks.' },
  { type: 'Focus', message: 'You maintain strong focus during morning sessions.' },
  { type: 'Consistency', message: 'Hitting your daily habits boosts your overall productivity.' },
];

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/actify');
    console.log('Connected.');

    const emails = SEED_USERS.map(u => u.email);

    console.log('Cleaning up existing seed data...');
    const existingUsers = await User.find({ email: { $in: emails } });
    const userIds = existingUsers.map(u => u._id);

    await User.deleteMany({ email: { $in: emails } });
    await Workspace.deleteMany({ ownerId: { $in: userIds } });
    await Task.deleteMany({ createdBy: { $in: userIds } });
    await Habit.deleteMany({ createdBy: { $in: userIds } });
    await FocusSession.deleteMany({ userId: { $in: userIds } });
    await Page.deleteMany({ createdBy: { $in: userIds } });
    await Activity.deleteMany({ userId: { $in: userIds } });
    await BehaviorPattern.deleteMany({ userId: { $in: userIds } });
    await Insight.deleteMany({ userId: { $in: userIds } });

    console.log('Generating realistic data...');
    
    const now = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(now.getDate() - 28);

    for (const seedUser of SEED_USERS) {
      // Create User
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(seedUser.password, salt);
      
      const lastActive = getRandomDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), now); // Sometime in the last 2 days
      const createdAt = getRandomDate(fourWeeksAgo, new Date(fourWeeksAgo.getTime() + 7 * 24 * 60 * 60 * 1000)); // Joined ~3-4 weeks ago

      const user = await User.create({
        name: seedUser.name,
        email: seedUser.email,
        password: hashedPassword, // Note: password will be re-hashed by pre-save hook, so we pass raw here
        profession: seedUser.profession,
        bio: seedUser.bio,
        lastActive: lastActive,
      });
      // Override the password hashing since pre-save hook does it automatically
      user.password = seedUser.password;
      await user.save();

      // Create Workspace
      const workspace = await Workspace.create({
        name: `${seedUser.name}'s Workspace`,
        ownerId: user._id,
        members: [{ userId: user._id, role: 'admin' }],
        settings: { isPublic: false }
      });

      // Generate 15 Tasks
      const tasks = TASK_POOLS[seedUser.profession] || TASK_POOLS['Software Engineer'];
      let completedTasksCount = 0;
      
      for (let i = 0; i < 15; i++) {
        const status = Math.random() > 0.4 ? 'Completed' : (Math.random() > 0.5 ? 'In Progress' : 'Pending');
        if (status === 'Completed') completedTasksCount++;
        
        const taskDate = getRandomDate(createdAt, now);
        
        const t = await Task.create({
          title: tasks[i % tasks.length],
          workspaceId: workspace._id,
          status: status,
          priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
          createdBy: user._id,
          assignedTo: user._id,
          createdAt: taskDate,
          updatedAt: status === 'Completed' ? getRandomDate(taskDate, now) : taskDate
        });
        
        await Activity.create({
          userId: user._id,
          action: status === 'Completed' ? 'Task Completed' : 'Task Created',
          entityType: 'Task',
          entityId: t._id,
          timestamp: taskDate
        });
      }

      // Generate 10 Habits
      const habits = [...HABIT_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
      for (const h of habits) {
        await Habit.create({
          title: h,
          workspaceId: workspace._id,
          createdBy: user._id,
          frequency: Math.random() > 0.2 ? 'Daily' : 'Weekly',
          streak: Math.floor(Math.random() * 15),
          createdAt: getRandomDate(createdAt, now)
        });
      }

      // Generate 10 Focus Sessions (5-10 mins)
      let totalFocusDuration = 0;
      for (let i = 0; i < 10; i++) {
        const durationMins = Math.floor(Math.random() * 6) + 5; // 5 to 10
        const durationSecs = durationMins * 60;
        totalFocusDuration += durationSecs;
        
        const sessionDate = getRandomDate(createdAt, now);
        const f = await FocusSession.create({
          userId: user._id,
          duration: durationSecs,
          interruptions: Math.floor(Math.random() * 4), // 0 to 3
          status: 'Completed',
          startTime: sessionDate,
          endTime: new Date(sessionDate.getTime() + durationSecs * 1000)
        });

        await Activity.create({
          userId: user._id,
          action: 'Focus Session Completed',
          entityType: 'FocusSession',
          entityId: f._id,
          timestamp: new Date(sessionDate.getTime() + durationSecs * 1000)
        });
      }

      // Generate 8-9 Pages
      const pageContents = PAGE_CONTENTS[seedUser.profession] || PAGE_CONTENTS['Default'];
      const numPages = Math.floor(Math.random() * 2) + 8; // 8 or 9
      for (let i = 0; i < numPages; i++) {
        const contentStr = pageContents[i % pageContents.length];
        const title = contentStr.split('\n')[0].replace('# ', '');
        
        const pDate = getRandomDate(createdAt, now);
        const p = await Page.create({
          title: title,
          workspaceId: workspace._id,
          content: contentStr,
          createdBy: user._id,
          createdAt: pDate,
          updatedAt: getRandomDate(pDate, now)
        });

        await Activity.create({
          userId: user._id,
          action: 'Page Created',
          entityType: 'Page',
          entityId: p._id,
          timestamp: pDate
        });
      }

      // Generate Behavior Pattern
      await BehaviorPattern.create({
        userId: user._id,
        productivityScore: Math.floor(Math.random() * 60) + 40, // 40-100
        focusScore: Math.floor(Math.random() * 60) + 40,
        consistencyScore: Math.floor(Math.random() * 60) + 40,
        procrastinationScore: Math.floor(Math.random() * 40), // 0-40
        completionEfficiency: Math.floor(Math.random() * 60) + 40,
        completedTasks: completedTasksCount,
        lastCalculatedAt: now
      });

      // Generate 5 Insights
      const userInsights = [...INSIGHTS].sort(() => 0.5 - Math.random()).slice(0, 5);
      for (const ins of userInsights) {
        await Insight.create({
          userId: user._id,
          message: ins.message,
          type: ins.type,
          generatedAt: getRandomDate(createdAt, now)
        });
      }

      // A few extra login activities
      for (let i = 0; i < 5; i++) {
        await Activity.create({
          userId: user._id,
          action: 'Login',
          entityType: 'User',
          entityId: user._id,
          timestamp: getRandomDate(createdAt, now)
        });
      }

      console.log(`Successfully seeded user: ${seedUser.name}`);
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
