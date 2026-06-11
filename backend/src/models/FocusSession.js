const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    duration: {
      type: Number, // duration in seconds
      required: true,
      default: 0,
    },
    interruptions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Completed', 'Cancelled'],
      default: 'Active',
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const FocusSession = mongoose.model('FocusSession', focusSessionSchema);
module.exports = FocusSession;
