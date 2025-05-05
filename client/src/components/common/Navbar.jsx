"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { FaGraduationCap, FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaGraduationCap className="logo-icon" />
          <span className="logo-text">EduPlatform</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>

              {user.role === "student" && (
                <li className="nav-item">
                  <Link to="/learning" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Learning
                  </Link>
                </li>
              )}

              {user.role === "teacher" && (
                <li className="nav-item">
                  <Link to="/notes-builder" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Create Content
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link to="/performance" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Performance
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/library" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Library
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/webinars" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Webinars
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/auth" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/auth" className="nav-link signup" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>

        {user && (
          <div className="user-menu-container">
            <div className="user-avatar" onClick={toggleUserMenu}>
              <img src={user.avatar || "/images/default-avatar.png"} alt={user.name} />
            </div>

            {userMenuOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-role">{user.role === "student" ? "Student" : "Teacher"}</p>
                </div>

                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                      <FaUser /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" onClick={() => setUserMenuOpen(false)}>
                      <FaCog /> Settings
                    </Link>
                  </li>
                  <li onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
