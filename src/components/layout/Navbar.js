"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Navbar.css"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`)
      setSearchQuery("")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            BookMyShow
          </Link>
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        </div>

        <div className="navbar-right">
          <div className="location-selector">
            <i className="fas fa-map-marker-alt"></i>
            <span>Mumbai</span>
          </div>

          {isAuthenticated ? (
            <div className="profile-dropdown">
              <button className="profile-btn" onClick={toggleProfileMenu}>
                <span>{user.name.split(" ")[0]}</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              {isProfileMenuOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/my-bookings" onClick={() => setIsProfileMenuOpen(false)}>
                    My Bookings
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setIsProfileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/change-password" onClick={() => setIsProfileMenuOpen(false)}>
                    Change Password
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline btn-sm">
                Register
              </Link>
            </div>
          )}

          <button className="menu-toggle" onClick={toggleMenu}>
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="search-bar-mobile">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div className="mobile-menu-items">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/theaters" onClick={() => setIsMenuOpen(false)}>
              Theaters
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)}>
                  My Bookings
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/change-password" onClick={() => setIsMenuOpen(false)}>
                  Change Password
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
