"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./AuthPages.css"

const ForgotPasswordPage = () => {
  const { forgotPassword, error, clearError } = useAuth()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    setEmailError("")

    // Clear global error
    if (error) {
      clearError()
    }
  }

  const validateForm = () => {
    if (!email.trim()) {
      setEmailError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setIsSubmitting(true)
        await forgotPassword(email)
        setSuccess(true)
      } catch (err) {
        console.error("Forgot password request failed:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your email to reset your password</p>

          {error && <div className="alert alert-error">{error}</div>}

          {success ? (
            <div className="success-message">
              <div className="alert alert-success">Password reset link has been sent to your email.</div>
              <div className="auth-footer">
                <p>
                  <Link to="/login">Back to Login</Link>
                </p>
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-control ${emailError ? "error" : ""}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                />
                {emailError && <div className="form-error">{emailError}</div>}
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Reset Password"}
              </button>

              <div className="auth-footer">
                <p>
                  Remember your password? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
