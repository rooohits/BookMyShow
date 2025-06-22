"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import "./App.css"

// Layout Components
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import AdminLayout from "./pages/admin/AdminLayout"

// Public Pages
import HomePage from "./pages/HomePage"
import MovieDetailsPage from "./pages/MovieDetailsPage"
import TheaterListPage from "./pages/TheaterListPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

// User Pages
import ProfilePage from '../src/pages/users/ProfilePage'
import BookingPage from '../src/pages/users/BookingPage'
import MyBookingsPage from '../src/pages/users/MyBookingsPage'
import BookingDetailsPage from '../src/pages/users/BookingDetailsPage'
import ChangePasswordPage from '../src/pages/users/ChangePasswordPage'

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import AdminMovieList from "./pages/admin/AdminMovieList"
import AdminMovieForm from "./pages/admin/AdminMovieForm"
import AdminMovieSuggestions from "./pages/admin/AdminMovieSuggestions"
import AdminTheatersPage from "./pages/admin/AdminTheatersPage"
import AdminShowsPage from "./pages/admin/AdminShowsPage"
import AdminBookingsPage from "./pages/admin/AdminBookingsPage"
import AdminUsersPage from "./pages/admin/AdminUsersPage"

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }

  return children
}

// Admin Route Component
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/movies"
            element={
              <AdminRoute>
                <AdminMovieList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/movies/add"
            element={
              <AdminRoute>
                <AdminMovieForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/movies/edit/:id"
            element={
              <AdminRoute>
                <AdminMovieForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/movies/suggestions"
            element={
              <AdminRoute>
                <AdminMovieSuggestions />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/theaters"
            element={
              <AdminRoute>
                <AdminTheatersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/shows"
            element={
              <AdminRoute>
                <AdminShowsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookingsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />

          {/* Public and User Routes */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <div className="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movie/:id" element={<MovieDetailsPage />} />
                    <Route path="/theaters" element={<TheaterListPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* User Routes */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/booking/:showId"
                      element={
                        <ProtectedRoute>
                          <BookingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-bookings"
                      element={
                        <ProtectedRoute>
                          <MyBookingsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/booking-details/:id"
                      element={
                        <ProtectedRoute>
                          <BookingDetailsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/change-password"
                      element={
                        <ProtectedRoute>
                          <ChangePasswordPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<div className="not-found">Page Not Found</div>} />
                  </Routes>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App