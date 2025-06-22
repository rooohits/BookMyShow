"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./ChangePasswordPage.css"

const ChangePasswordPage = () => {
  const { changePassword, error, clearError } = useAuth()

  const [formData, setFormData] = useState({
    currentPassword: "",
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

    // Clear success message
    if (success) {
      setSuccess(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required"
    }

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

    if (validateForm()) {
      try {
        setIsSubmitting(true)
        await changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
        setSuccess(true)
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } catch (err) {
        console.error("Password change failed:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="change-password-page">
      <div className="container">
        <h1 className="page-title">Change Password</h1>

        <div className="change-password-container">
          <div className="sidebar">
            <div className="profile-menu">
              <Link to="/profile" className="menu-item">
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </Link>
              <Link to="/my-bookings" className="menu-item">
                <i className="fas fa-ticket-alt"></i>
                <span>My Bookings</span>
              </Link>
              <Link to="/change-password" className="menu-item active">
                <i className="fas fa-lock"></i>
                <span>Change Password</span>
              </Link>
            </div>
          </div>

          <div className="content">
            <div className="card">
              <div className="card-header">
                <h2>Change Your Password</h2>
              </div>

              <div className="card-body">
                {error && <div className="alert alert-error">{error}</div>}

                {success && <div className="alert alert-success">Your password has been changed successfully!</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className={`form-control ${formErrors.currentPassword ? "error" : ""}`}
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                    {formErrors.currentPassword && <div className="form-error">{formErrors.currentPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className={`form-control ${formErrors.newPassword ? "error" : ""}`}
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    {formErrors.newPassword && <div className="form-error">{formErrors.newPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-control ${formErrors.confirmPassword ? "error" : ""}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    {formErrors.confirmPassword && <div className="form-error">{formErrors.confirmPassword}</div>}
                  </div>

                  <div className="password-requirements">
                    <h3>Password Requirements:</h3>
                    <ul>
                      <li>At least 6 characters long</li>
                      <li>Include a mix of letters, numbers, and special characters for better security</li>
                    </ul>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Changing Password..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPage
