"use client"

import { useState, useEffect } from "react"
import api from "../services/api"
import { FaSearch, FaFilter, FaPlay, FaClock } from "react-icons/fa"
import "./LearningPage.css"

const LearningPage = () => {
  const [activeLevel, setActiveLevel] = useState("beginner")
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    topic: "",
    duration: "",
    contentType: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/courses?level=${activeLevel}`)
        setCourses(response.data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [activeLevel])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
  }

  const openCourseViewer = (course) => {
    setSelectedCourse(course)
  }

  const closeCourseViewer = () => {
    setSelectedCourse(null)
  }

  const filteredCourses = courses.filter((course) => {
    let matches = true

    if (filters.topic && course.topic !== filters.topic) {
      matches = false
    }

    if (filters.duration) {
      const [min, max] = filters.duration.split("-").map(Number)
      if (course.durationMinutes < min || course.durationMinutes > max) {
        matches = false
      }
    }

    if (filters.contentType && course.contentType !== filters.contentType) {
      matches = false
    }

    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      matches = false
    }

    return matches
  })

  return (
    <div className="learning-page">
      <div className="learning-header">
        <h1>Learning Center</h1>
        <p>Explore courses and expand your knowledge</p>
      </div>

      <div className="level-tabs">
        <button className={activeLevel === "beginner" ? "active" : ""} onClick={() => setActiveLevel("beginner")}>
          Beginner
        </button>
        <button
          className={activeLevel === "intermediate" ? "active" : ""}
          onClick={() => setActiveLevel("intermediate")}
        >
          Intermediate
        </button>
        <button className={activeLevel === "advanced" ? "active" : ""} onClick={() => setActiveLevel("advanced")}>
          Advanced
        </button>
      </div>

      <div className="learning-content">
        <div className="filter-panel">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>

          <div className="filters">
            <h3>
              <FaFilter /> Filters
            </h3>

            <div className="filter-group">
              <label>Topic</label>
              <select name="topic" value={filters.topic} onChange={handleFilterChange}>
                <option value="">All Topics</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="language">Language</option>
                <option value="history">History</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Duration</label>
              <select name="duration" value={filters.duration} onChange={handleFilterChange}>
                <option value="">Any Duration</option>
                <option value="0-15">Under 15 minutes</option>
                <option value="15-30">15-30 minutes</option>
                <option value="30-60">30-60 minutes</option>
                <option value="60-9999">Over 60 minutes</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Content Type</label>
              <select name="contentType" value={filters.contentType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="video">Video</option>
                <option value="interactive">Interactive</option>
                <option value="reading">Reading</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>

            <button className="reset-filters" onClick={() => setFilters({ topic: "", duration: "", contentType: "" })}>
              Reset Filters
            </button>
          </div>
        </div>

        <div className="courses-grid">
          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : filteredCourses.length === 0 ? (
            <div className="no-courses">No courses match your filters</div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course._id} className="course-card" onClick={() => openCourseViewer(course)}>
                <div className="course-thumbnail">
                  <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} />
                  <div className="course-level">{course.level}</div>
                  <button className="play-button">
                    <FaPlay />
                  </button>
                </div>
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <div className="course-meta">
                    <span>
                      <FaClock /> {course.durationMinutes} mins
                    </span>
                    <span>{course.contentType}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedCourse && (
        <div className="course-viewer-modal">
          <div className="course-viewer-content">
            <button className="close-viewer" onClick={closeCourseViewer}>
              ×
            </button>

            <div className="viewer-header">
              <h2>{selectedCourse.title}</h2>
              <div className="course-meta">
                <span>{selectedCourse.level}</span>
                <span>{selectedCourse.durationMinutes} mins</span>
                <span>{selectedCourse.contentType}</span>
              </div>
            </div>

            <div className="viewer-body">
              {selectedCourse.contentType === "video" ? (
                <div className="video-container">
                  <video controls src={selectedCourse.videoUrl}></video>
                </div>
              ) : selectedCourse.contentType === "interactive" ? (
                <div className="interactive-container">
                  <iframe src={selectedCourse.interactiveUrl} title={selectedCourse.title}></iframe>
                </div>
              ) : (
                <div className="content-container">
                  <div dangerouslySetInnerHTML={{ __html: selectedCourse.content }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningPage
