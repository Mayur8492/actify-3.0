const mongoose = require('mongoose');

const behaviorPatternSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    productivityScore: {
      type: Number,
      default: 0,
    },
    focusScore: {
      type: Number,
      default: 0,
    },
    consistencyScore: {
      type: Number,
      default: 0,
    },
    procrastinationScore: {
      type: Number,
      default: 0,
    },
    completionEfficiency: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    lastCalculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const BehaviorPattern = mongoose.model('BehaviorPattern', behaviorPatternSchema);
module.exports = BehaviorPattern;
