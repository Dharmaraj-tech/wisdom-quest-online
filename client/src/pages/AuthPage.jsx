"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaGoogle, FaMicrosoft } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import "./AuthPage.css"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState("student")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        // Validation
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match")
        }

        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
        })
      }

      // Redirect to dashboard on success
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{isLogin ? "Welcome Back" : "Join Us Today"}</h1>
          <div className="role-toggle">
            <button className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>
              Student
            </button>
            <button className={role === "teacher" ? "active" : ""} onClick={() => setRole("teacher")}>
              Teacher
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {!isLogin && <div className="password-strength-meter"></div>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="social-login">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button className="google-btn">
              <FaGoogle /> Google
            </button>
            <button className="microsoft-btn">
              <FaMicrosoft /> Microsoft
            </button>
          </div>
        </div>

        <div className="auth-footer">
          {isLogin ? (
            <>
              <a href="#forgot-password">Forgot Password?</a>
              <p>
                Don't have an account? <button onClick={() => setIsLogin(false)}>Sign Up</button>
              </p>
            </>
          ) : (
            <p>
              Already have an account? <button onClick={() => setIsLogin(true)}>Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
