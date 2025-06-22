"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./AdminPages.css"

const AdminLoginPage = () => {
  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setIsSubmitting(true)
        const response = await login(formData)

        // Check if user is admin
        if (response.user.role !== "admin") {
          setFormErrors({
            general: "Access denied. Admin privileges required.",
          })
          return
        }

        navigate("/admin")
      } catch (err) {
        console.error("Login failed:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1>Admin Login</h1>
            <p>Enter your credentials to access the admin dashboard</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {formErrors.general && <div className="alert alert-error">{formErrors.general}</div>}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${formErrors.email ? "error" : ""}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && <div className="form-error">{formErrors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${formErrors.password ? "error" : ""}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && <div className="form-error">{formErrors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login to Admin Portal"}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>
              Return to <a href="/">main site</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage