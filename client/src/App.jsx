"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import DashboardPage from "./pages/DashboardPage"
import LearningPage from "./pages/LearningPage"
import NotesBuilderPage from "./pages/NotesBuilderPage"
import PerformancePage from "./pages/PerformancePage"
import ReportsPage from "./pages/ReportsPage"
import CommunityLibraryPage from "./pages/CommunityLibraryPage"
import WebinarPage from "./pages/WebinarPage"
import Navbar from "./components/common/Navbar"
import Footer from "./components/common/Footer"
import "./App.css"

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/auth" />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learning"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <LearningPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes-builder"
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <NotesBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performance"
                element={
                  <ProtectedRoute>
                    <PerformancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <CommunityLibraryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/webinars"
                element={
                  <ProtectedRoute>
                    <WebinarPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
