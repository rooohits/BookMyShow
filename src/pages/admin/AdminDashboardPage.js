"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "./AdminPages.css"

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheaters: 0,
    totalShows: 0,
    totalBookings: 0,
    totalUsers: 0,
    recentBookings: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // In a real app, you would have an API endpoint for dashboard stats
        // For now, we'll simulate by fetching data from different endpoints

        const [movies, theaters, shows, bookings, users] = await Promise.all([
          api.get("/api/movies"),
          api.get("/api/theaters"),
          api.get("/api/shows"),
          api.get("/api/bookings"),
          api.get("/api/users"),
        ])

        setStats({
          totalMovies: movies.data.movies.length,
          totalTheaters: theaters.data.theaters.length,
          totalShows: shows.data.shows.length,
          totalBookings: bookings.data.bookings.length,
          totalUsers: users.data.users.length,
          recentBookings: bookings.data.bookings.slice(0, 5), // Get 5 most recent bookings
        })
      } catch (err) {
        setError("Failed to fetch dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return <div className="admin-container loading">Loading dashboard data...</div>
  }

  if (error) {
    return <div className="admin-container error">{error}</div>
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome to the BookMyShow admin panel</p>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-content">
              <h2>{stats.totalMovies}</h2>
              <p>Movies</p>
            </div>
            <Link to="/admin/movies" className="stat-link">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <div className="stat-card">
            
            <div className="stat-content">
              <h2>{stats.totalTheaters}</h2>
              <p>Theaters</p>
            </div>
            <Link to="/admin/theaters" className="stat-link">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <div className="stat-card">
            
            <div className="stat-content">
              <h2>{stats.totalShows}</h2>
              <p>Shows</p>
            </div>
            <Link to="/admin/shows" className="stat-link">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <div className="stat-card">
            
            <div className="stat-content">
              <h2>{stats.totalBookings}</h2>
              <p>Bookings</p>
            </div>
            <Link to="/admin/bookings" className="stat-link">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <div className="stat-card">
            
            <div className="stat-content">
              <h2>{stats.totalUsers}</h2>
              <p>Users</p>
            </div>
            <Link to="/admin/users" className="stat-link">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="admin-content-grid">
          <div className="admin-card recent-bookings">
            <div className="admin-card-header">
              <h2>Recent Bookings</h2>
              <Link to="/admin/bookings" className="view-all">
                View All
              </Link>
            </div>
            <div className="admin-card-body">
              {stats.recentBookings.length === 0 ? (
                <div className="no-data">No recent bookings</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User</th>
                      <th>Movie</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking._id.substring(0, 8)}</td>
                        <td>{booking.userId?.name || "Unknown User"}</td>
                        <td>{booking.showId.movieId.title}</td>
                        <td>{formatDate(booking.bookingDate)}</td>
                        <td>₹{booking.totalAmount}</td>
                        <td>
                          <span className={`status-badge ${booking.paymentStatus}`}>{booking.paymentStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="admin-card quick-actions">
            <div className="admin-card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="admin-card-body">
              <div className="action-buttons">
                <Link to="/admin/movies/add" className="btn btn-primary">
                  <i className="fas fa-plus"></i> Add Movie
                </Link>
                <Link to="/admin/theaters/add" className="btn btn-primary">
                  <i className="fas fa-plus"></i> Add Theater
                </Link>
                <Link to="/admin/shows/add" className="btn btn-primary">
                  <i className="fas fa-plus"></i> Add Show
                </Link>
                <Link to="/admin/users/add" className="btn btn-primary">
                  <i className="fas fa-plus"></i> Add Admin User
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
