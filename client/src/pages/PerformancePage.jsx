"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { Line, Pie, Bar } from "react-chartjs-2"
import { Chart, registerables } from "chart.js"
import { FaFilter, FaDownload, FaExclamationTriangle } from "react-icons/fa"
import "./PerformancePage.css"

// Register Chart.js components
Chart.register(...registerables)

const PerformancePage = () => {
  const { user } = useAuth()
  const [performanceData, setPerformanceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("month")
  const [subject, setSubject] = useState("all")

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await api.get(`/performance?role=${user.role}&timeRange=${timeRange}&subject=${subject}`)
        setPerformanceData(response.data)
      } catch (error) {
        console.error("Error fetching performance data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPerformanceData()
    }
  }, [user, timeRange, subject])

  if (loading) {
    return <div className="loading">Loading performance data...</div>
  }

  return (
    <div className="performance-page">
      <div className="performance-header">
        <h1>Performance Analytics</h1>
        <div className="filter-controls">
          <div className="filter-group">
            <label>Time Range:</label>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Subject:</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="all">All Subjects</option>
              <option value="math">Mathematics</option>
              <option value="science">Science</option>
              <option value="language">Language</option>
              <option value="history">History</option>
            </select>
          </div>

          <button className="export-button">
            <FaDownload /> Export Data
          </button>
        </div>
      </div>

      <div className="performance-content">
        {user.role === "student" ? (
          <StudentPerformance data={performanceData} />
        ) : (
          <TeacherPerformance data={performanceData} />
        )}
      </div>
    </div>
  )
}

const StudentPerformance = ({ data }) => {
  // Chart data for quiz scores
  const quizScoreData = {
    labels: data.quizScores.map((item) => item.date),
    datasets: [
      {
        label: "Quiz Scores",
        data: data.quizScores.map((item) => item.score),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  }

  // Chart data for topic mastery
  const topicMasteryData = {
    labels: data.topicMastery.map((item) => item.topic),
    datasets: [
      {
        label: "Topic Mastery",
        data: data.topicMastery.map((item) => item.masteryPercentage),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Chart data for learning time
  const learningTimeData = {
    labels: data.learningTime.map((item) => item.day),
    datasets: [
      {
        label: "Learning Time (minutes)",
        data: data.learningTime.map((item) => item.minutes),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="student-performance">
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Quiz Score Timeline</h3>
          <div className="chart-container">
            <Line data={quizScoreData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Topic Mastery Breakdown</h3>
          <div className="chart-container">
            <Pie data={topicMasteryData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Learning Time</h3>
          <div className="chart-container">
            <Bar data={learningTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="performance-summary">
        <h3>Performance Summary</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-label">Average Quiz Score</div>
            <div className="stat-value">{data.averageQuizScore}%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Total Learning Time</div>
            <div className="stat-value">{data.totalLearningHours} hours</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Completed Courses</div>
            <div className="stat-value">{data.completedCourses}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TeacherPerformance = ({ data }) => {
  // Chart data for class average
  const classAverageData = {
    labels: data.classAverage.map((item) => item.date),
    datasets: [
      {
        label: "Class Average",
        data: data.classAverage.map((item) => item.average),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="teacher-performance">
      <div className="chart-card full-width">
        <h3>Class Performance Average</h3>
        <div className="chart-container">
          <Line data={classAverageData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="alerts-section">
        <h3>Student Alerts</h3>
        <div className="alerts-list">
          {data.studentAlerts.map((alert, index) => (
            <div key={index} className="alert-item">
              <div className="alert-icon">
                <FaExclamationTriangle />
              </div>
              <div className="alert-content">
                <p className="alert-text">{alert.message}</p>
                <p className="alert-student">{alert.studentName}</p>
              </div>
              <div className="alert-action">
                <button>Contact</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="student-table">
        <h3>Individual Student Performance</h3>
        <div className="table-filters">
          <input type="text" placeholder="Search students..." />
          <button>
            <FaFilter /> Filter
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Average Score</th>
              <th>Completed</th>
              <th>Learning Time</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.studentPerformance.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.averageScore}%</td>
                <td>{student.completionPercentage}%</td>
                <td>{student.learningHours} hrs</td>
                <td>{student.lastActive}</td>
                <td>
                  <button className="view-details">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PerformancePage
