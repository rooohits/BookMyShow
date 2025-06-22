"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./AuthPages.css"

const ResetPasswordPage = () => {
  const { resetPassword, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get token from URL query params
  const queryParams = new URLSearchParams(location.search)
  const resetToken = queryParams.get("token")

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }

    // Clear global error
    if (error) {
      clearError()
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.newPassword) {
      errors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters"
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!resetToken) {
      setFormErrors({ general: "Reset token is missing" })
      return
    }

    if (validateForm()) {
      try {
        setIsSubmitting(true)
        await resetPassword({
          resetToken,
          newPassword: formData.newPassword,
        })
        setSuccess(true)

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } catch (err) {
        console.error("Password reset failed:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (!resetToken) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-form-container">
            <h1 className="auth-title">Invalid Reset Link</h1>
            <p className="auth-subtitle">The password reset link is invalid or has expired.</p>
            <div className="auth-footer">
              <p>
                <Link to="/forgot-password">Request a new reset link</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Create a new password for your account</p>

          {error && <div className="alert alert-error">{error}</div>}

          {formErrors.general && <div className="alert alert-error">{formErrors.general}</div>}

          {success ? (
            <div className="success-message">
              <div className="alert alert-success">
                Your password has been reset successfully. Redirecting to login...
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className={`form-control ${formErrors.newPassword ? "error" : ""}`}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                {formErrors.newPassword && <div className="form-error">{formErrors.newPassword}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${formErrors.confirmPassword ? "error" : ""}`}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {formErrors.confirmPassword && <div className="form-error">{formErrors.confirmPassword}</div>}
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
