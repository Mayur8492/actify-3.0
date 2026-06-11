const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Productivity', 'Focus', 'Procrastination', 'Consistency', 'Recommendation'],
      default: 'Recommendation',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Insight = mongoose.model('Insight', insightSchema);
module.exports = Insight;
