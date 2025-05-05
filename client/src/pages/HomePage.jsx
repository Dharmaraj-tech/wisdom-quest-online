import { Link } from "react-router-dom"
import { FaGraduationCap, FaChalkboardTeacher, FaBook, FaChartLine, FaCalendarAlt } from "react-icons/fa"
import "./HomePage.css"

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Empowering every student. Enabling every teacher.</h1>
          <h2>Education reimagined.</h2>
          <div className="cta-buttons">
            <Link to="/auth" className="cta-button student">
              <FaGraduationCap /> Start Learning
            </Link>
            <Link to="/auth" className="cta-button teacher">
              <FaChalkboardTeacher /> Empower Your Classroom
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/modern-learning.svg" alt="Modern Learning" />
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-section">
        <h2>Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaBook className="feature-icon" />
            <h3>AI-Powered Notes</h3>
            <p>Generate comprehensive notes with our AI assistant</p>
          </div>
          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <p>Track progress with detailed analytics</p>
          </div>
          <div className="feature-card">
            <FaCalendarAlt className="feature-icon" />
            <h3>Live Webinars</h3>
            <p>Join interactive sessions with experts</p>
          </div>
          {/* More feature cards */}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account in seconds</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Choose Role</h3>
            <p>Student or Teacher</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Start Learning</h3>
            <p>Access courses and resources</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-carousel">
          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p>"This platform transformed how I teach mathematics. My students are more engaged than ever!"</p>
            <div className="testimonial-author">- Sarah J., Math Teacher</div>
          </div>
          {/* More testimonials would be added here and controlled by carousel JS */}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>Stay Updated</h2>
        <p>Get the latest educational resources and updates</p>
        <form className="newsletter-form">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </div>
  )
}

export default HomePage
