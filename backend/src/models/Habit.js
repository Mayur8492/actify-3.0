const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly'],
      default: 'Daily',
    },
    time: {
      type: String, // e.g., "08:00 AM"
      default: '',
    },
    completedDates: [
      {
        type: String, // ISO date strings e.g. "2026-06-10"
      }
    ],
    streak: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;
