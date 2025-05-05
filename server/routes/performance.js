const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Performance = require("../models/Performance")
const User = require("../models/User")

// @route   GET api/performance
// @desc    Get performance data based on user role
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { role, timeRange, subject } = req.query

    if (role === "student") {
      // Mock student performance data
      const quizScores = [
        { date: "2023-01-01", score: 85 },
        { date: "2023-01-08", score: 90 },
        { date: "2023-01-15", score: 78 },
        { date: "2023-01-22", score: 92 },
        { date: "2023-01-29", score: 88 },
        { date: "2023-02-05", score: 95 },
      ]

      const topicMastery = [
        { topic: "Algebra", masteryPercentage: 85 },
        { topic: "Geometry", masteryPercentage: 70 },
        { topic: "Calculus", masteryPercentage: 60 },
        { topic: "Statistics", masteryPercentage: 90 },
        { topic: "Physics", masteryPercentage: 75 },
      ]

      const learningTime = [
        { day: "Monday", minutes: 45 },
        { day: "Tuesday", minutes: 60 },
        { day: "Wednesday", minutes: 30 },
        { day: "Thursday", minutes: 75 },
        { day: "Friday", minutes: 50 },
        { day: "Saturday", minutes: 90 },
        { day: "Sunday", minutes: 20 },
      ]

      const averageQuizScore = quizScores.reduce((sum, item) => sum + item.score, 0) / quizScores.length
      const totalLearningHours = learningTime.reduce((sum, item) => sum + item.minutes, 0) / 60
      const completedCourses = 5

      res.json({
        quizScores,
        topicMastery,
        learningTime,
        averageQuizScore,
        totalLearningHours,
        completedCourses,
      })
    } else if (role === "teacher") {
      // Mock teacher performance data
      const classAverage = [
        { date: "2023-01-01", average: 75 },
        { date: "2023-01-08", average: 78 },
        { date: "2023-01-15", average: 72 },
        { date: "2023-01-22", average: 80 },
        { date: "2023-01-29", average: 82 },
        { date: "2023-02-05", average: 85 },
      ]

      const studentAlerts = [
        {
          studentName: "John Doe",
          message: "Quiz score below 60% for 3 consecutive quizzes",
        },
        {
          studentName: "Jane Smith",
          message: "No activity for 2 weeks",
        },
        {
          studentName: "Mike Johnson",
          message: "Significant improvement in recent assessments",
        },
      ]

      const studentPerformance = [
        {
          name: "John Doe",
          averageScore: 65,
          completionPercentage: 40,
          learningHours: 12,
          lastActive: "2 days ago",
        },
        {
          name: "Jane Smith",
          averageScore: 78,
          completionPercentage: 60,
          learningHours: 18,
          lastActive: "14 days ago",
        },
        {
          name: "Mike Johnson",
          averageScore: 92,
          completionPercentage: 85,
          learningHours: 25,
          lastActive: "1 day ago",
        },
        {
          name: "Sarah Williams",
          averageScore: 88,
          completionPercentage: 75,
          learningHours: 20,
          lastActive: "3 days ago",
        },
        {
          name: "David Brown",
          averageScore: 72,
          completionPercentage: 50,
          learningHours: 15,
          lastActive: "5 days ago",
        },
      ]

      res.json({
        classAverage,
        studentAlerts,
        studentPerformance,
      })
    } else {
      return res.status(400).json({ message: "Invalid role" })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
