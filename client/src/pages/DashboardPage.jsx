"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { FaBook, FaChartLine, FaCalendarAlt, FaPlus, FaBell } from "react-icons/fa"
import "./DashboardPage.css"

const DashboardPage = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(`/dashboard/${user.role}`)
        setDashboardData(response.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="user-avatar">
            <img src={user.avatar || "/images/default-avatar.png"} alt={user.name} />
          </div>
          <div className="welcome-text">
            <h1>Welcome back, {user.name}!</h1>
            <p>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {user.role === "student" ? (
          <StudentDashboard data={dashboardData} />
        ) : (
          <TeacherDashboard data={dashboardData} />
        )}
      </div>
    </div>
  )
}

const StudentDashboard = ({ data }) => {
  return (
    <>
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Learning Hours</h3>
          <div className="stat-value">{data.learningHours} hrs</div>
          <div className="stat-period">This Week</div>
        </div>
        <div className="stat-card">
          <h3>Completion</h3>
          <div className="stat-value">{data.completionPercentage}%</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${data.completionPercentage}%` }}></div>
          </div>
        </div>
        <div className="stat-card">
          <h3>Courses</h3>
          <div className="stat-value">{data.enrolledCourses}</div>
          <div className="stat-period">Enrolled</div>
        </div>
      </div>

      <div className="quick-access-section">
        <h2>Quick Access</h2>
        <div className="quick-access-cards">
          <Link to={`/learning/course/${data.recentCourse?.id}`} className="quick-card">
            <div className="card-icon">
              <FaBook />
            </div>
            <div className="card-content">
              <h3>Continue Learning</h3>
              <p>{data.recentCourse?.title || "No recent course"}</p>
            </div>
          </Link>
          <Link to="/reports" className="quick-card">
            <div className="card-icon">
              <FaChartLine />
            </div>
            <div className="card-content">
              <h3>Your Reports</h3>
              <p>View your performance analytics</p>
            </div>
          </Link>
          <Link to="/webinars" className="quick-card">
            <div className="card-icon">
              <FaCalendarAlt />
            </div>
            <div className="card-content">
              <h3>Upcoming Webinars</h3>
              <p>{data.upcomingWebinars} scheduled</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {data.recentActivities?.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{getActivityIcon(activity.type)}</div>
              <div className="activity-content">
                <p className="activity-text">{activity.description}</p>
                <p className="activity-time">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const TeacherDashboard = ({ data }) => {
  return (
    <>
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Students</h3>
          <div className="stat-value">{data.studentsEnrolled}</div>
          <div className="stat-period">Enrolled</div>
        </div>
        <div className="stat-card">
          <h3>Assignments</h3>
          <div className="stat-value">{data.assignmentsDue}</div>
          <div className="stat-period">Due Soon</div>
        </div>
        <div className="stat-card">
          <h3>Messages</h3>
          <div className="stat-value">{data.newMessages}</div>
          <div className="stat-period">Unread</div>
        </div>
      </div>

      <div className="quick-access-section">
        <h2>Teacher Tools</h2>
        <div className="quick-access-cards">
          <Link to="/notes-builder" className="quick-card">
            <div className="card-icon">
              <FaPlus />
            </div>
            <div className="card-content">
              <h3>Create Notes/Quizzes</h3>
              <p>Build learning materials</p>
            </div>
          </Link>
          <Link to="/performance" className="quick-card">
            <div className="card-icon">
              <FaChartLine />
            </div>
            <div className="card-content">
              <h3>Analyze Progress</h3>
              <p>Track student performance</p>
            </div>
          </Link>
          <Link to="/webinars/create" className="quick-card">
            <div className="card-icon">
              <FaCalendarAlt />
            </div>
            <div className="card-content">
              <h3>Schedule Webinar</h3>
              <p>Create live learning sessions</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="student-alerts">
        <div className="section-header">
          <h2>Student Alerts</h2>
          <Link to="/performance" className="view-all">
            View All
          </Link>
        </div>
        <div className="alerts-list">
          {data.studentAlerts?.map((alert, index) => (
            <div key={index} className="alert-item">
              <div className="alert-icon">
                <FaBell />
              </div>
              <div className="alert-content">
                <p className="alert-text">{alert.message}</p>
                <p className="alert-student">{alert.studentName}</p>
              </div>
              <div className="alert-action">
                <button>Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// Helper functions
const getActivityIcon = (type) => {
  switch (type) {
    case "course":
      return <FaBook />
    case "report":
      return <FaChartLine />
    case "webinar":
      return <FaCalendarAlt />
    default:
      return <FaBook />
  }
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const activityTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60))

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }
}

export default DashboardPage
