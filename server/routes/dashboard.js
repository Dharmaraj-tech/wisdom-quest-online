const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const User = require("../models/User")
const Course = require("../models/Course")
const Performance = require("../models/Performance")
const Webinar = require("../models/Webinar")

// @route   GET api/dashboard/:role
// @desc    Get dashboard data based on user role
// @access  Private
router.get("/:role", auth, async (req, res) => {
  try {
    const { role } = req.params

    if (role === "student") {
      // Get student dashboard data
      const performances = await Performance.find({ student: req.user.id })
      const enrolledCourses = await Course.find({ _id: { $in: (await User.findById(req.user.id)).enrolledCourses } })
      const upcomingWebinars = await Webinar.countDocuments({
        date: { $gt: new Date() },
        attendees: req.user.id,
      })

      // Calculate learning hours
      const learningHours = performances.reduce((total, perf) => total + perf.learningTime / 60, 0).toFixed(1)

      // Calculate completion percentage
      const totalCourses = enrolledCourses.length
      const completedCourses = (await User.findById(req.user.id)).completedCourses.length
      const completionPercentage = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0

      // Get recent course
      const recentCourse =
        enrolledCourses.length > 0
          ? enrolledCourses.sort((a, b) => {
              const aPerf = performances.find((p) => p.course.toString() === a._id.toString())
              const bPerf = performances.find((p) => p.course.toString() === b._id.toString())
              return (bPerf?.lastActive || 0) - (aPerf?.lastActive || 0)
            })[0]
          : null

      // Mock recent activities
      const recentActivities = [
        {
          type: "course",
          description: 'Completed "Introduction to Algebra" quiz',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
          type: "webinar",
          description: 'Registered for "Advanced Physics" webinar',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
        },
        {
          type: "report",
          description: "Viewed performance report",
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
        },
      ]

      res.json({
        learningHours,
        completionPercentage,
        enrolledCourses: totalCourses,
        recentCourse: recentCourse
          ? {
              id: recentCourse._id,
              title: recentCourse.title,
            }
          : null,
        upcomingWebinars,
        recentActivities,
      })
    } else if (role === "teacher") {
      // Get teacher dashboard data
      const courses = await Course.find({ creator: req.user.id })
      const courseIds = courses.map((course) => course._id)

      // Count enrolled students
      const studentsEnrolled = await User.countDocuments({
        enrolledCourses: { $in: courseIds },
        role: "student",
      })

      // Mock assignments due
      const assignmentsDue = 12

      // Mock new messages
      const newMessages = 5

      // Mock student alerts
      const studentAlerts = [
        {
          studentName: "John Doe",
          message: "Has not logged in for 7 days",
        },
        {
          studentName: "Jane Smith",
          message: "Failed quiz 3 times",
        },
        {
          studentName: "Mike Johnson",
          message: "Completed all courses",
        },
      ]

      res.json({
        studentsEnrolled,
        assignmentsDue,
        newMessages,
        studentAlerts,
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
