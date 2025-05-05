const mongoose = require("mongoose")

const PerformanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  quizScores: [
    {
      quizId: String,
      score: Number,
      maxScore: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  completionPercentage: {
    type: Number,
    default: 0,
  },
  learningTime: {
    type: Number, // in minutes
    default: 0,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Performance", PerformanceSchema)
