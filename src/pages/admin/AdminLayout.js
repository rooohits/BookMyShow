"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./AdminLayout.css"

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login")
    }
  }, [user, navigate])

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  // Navigation items
  const navItems = [
    { path: "/admin", icon: "fas fa-tachometer-alt", label: "Dashboard" },
    { path: "/admin/movies", icon: "fas fa-film", label: "Movies" },
    { path: "/admin/theaters", icon: "fas fa-building", label: "Theaters" },
    { path: "/admin/shows", icon: "fas fa-calendar-alt", label: "Shows" },
    { path: "/admin/bookings", icon: "fas fa-ticket-alt", label: "Bookings" },
    { path: "/admin/users", icon: "fas fa-users", label: "Users" },
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="admin-sidebar-header">
          <h2>BookMyShow</h2>
          <span>Admin Portal</span>
        </div>

        <nav className="admin-sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas ${isSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>

          <div className="admin-header-right">
            <div className="admin-user-info">
              <span>Welcome, {user?.name}</span>
              <span className="admin-role-badge">Admin</span>
            </div>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout