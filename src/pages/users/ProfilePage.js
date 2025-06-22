"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./ProfilePage.css"

const ProfilePage = () => {
  const { user, updateProfile, error, clearError } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profilePic: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profilePic: user.profilePic || "",
      })
    }
  }, [user])

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

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setIsSubmitting(true)
        await updateProfile(formData)
        setSuccess(true)

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } catch (err) {
        console.error("Profile update failed:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">My Profile</h1>

        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                {formData.profilePic ? (
                  <img src={formData.profilePic || "/placeholder.svg"} alt={formData.name} />
                ) : (
                  <div className="avatar-placeholder">{formData.name.charAt(0)}</div>
                )}
              </div>
              <div className="profile-info">
                <h2>{formData.name}</h2>
                <p>{user?.email}</p>
              </div>
            </div>

            <div className="profile-menu">
              <Link to="/profile" className="menu-item active">
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </Link>
              <Link to="/my-bookings" className="menu-item">
                <i className="fas fa-ticket-alt"></i>
                <span>My Bookings</span>
              </Link>
              <Link to="/change-password" className="menu-item">
                <i className="fas fa-lock"></i>
                <span>Change Password</span>
              </Link>
            </div>
          </div>

          <div className="profile-content">
            <div className="card">
              <div className="card-header">
                <h2>Edit Profile</h2>
              </div>

              <div className="card-body">
                {error && <div className="alert alert-error">{error}</div>}

                {success && <div className="alert alert-success">Profile updated successfully!</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${formErrors.name ? "error" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {formErrors.name && <div className="form-error">{formErrors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input type="email" id="email" className="form-control" value={user?.email || ""} disabled />
                    <small>Email cannot be changed</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-control ${formErrors.phone ? "error" : ""}`}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="profilePic" className="form-label">
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      id="profilePic"
                      name="profilePic"
                      className="form-control"
                      placeholder="Enter URL for profile picture"
                      value={formData.profilePic}
                      onChange={handleChange}
                    />
                    <small>Leave empty to use default avatar</small>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
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

export default ProfilePage
