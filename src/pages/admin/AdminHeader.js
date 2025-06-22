"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./AdminHeader.css"

const AdminHeader = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="admin-header">
      <div className="header-left">
        <h2>BookMyShow Admin</h2>
      </div>

      <div className="header-right">
        <div className="admin-profile">
          <button className="profile-button" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
            <div className="profile-avatar">
              <i className="fas fa-user"></i>
            </div>
            <span className="profile-name">{user?.name || "Admin"}</span>
            <i className="fas fa-chevron-down"></i>
          </button>

          {isProfileMenuOpen && (
            <div className="profile-dropdown">
              <Link to="/admin/profile" onClick={() => setIsProfileMenuOpen(false)}>
                <i className="fas fa-user-circle"></i> Profile
              </Link>
              <Link to="/admin/settings" onClick={() => setIsProfileMenuOpen(false)}>
                <i className="fas fa-cog"></i> Settings
              </Link>
              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader

