"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import "./AdminPages.css"

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBookings, setFilteredBookings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const res = await api.get("/api/bookings")
        setBookings(res.data.bookings)
        setFilteredBookings(res.data.bookings)
      } catch (err) {
        setError("Failed to fetch bookings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Handle search and filter
  useEffect(() => {
    let filtered = bookings

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((booking) => booking.paymentStatus === statusFilter)
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate)
        return (
          bookingDate.getDate() === filterDate.getDate() &&
          bookingDate.getMonth() === filterDate.getMonth() &&
          bookingDate.getFullYear() === filterDate.getFullYear()
        )
      })
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (booking) =>
          booking.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.userId.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.showId.movieId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.showId.theaterId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking._id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
  }, [searchQuery, statusFilter, dateFilter, bookings])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format seat (e.g., "A1")
  const formatSeat = (seat) => `${seat.row}${seat.number}`

  // Handle booking cancel
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.delete(`/api/bookings/${bookingId}`)

        // Update local state
        setBookings(bookings.filter((booking) => booking._id !== bookingId))
        setFilteredBookings(filteredBookings.filter((booking) => booking._id !== bookingId))
      } catch (err) {
        console.error("Failed to cancel booking:", err)
      }
    }
  }

  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return <div className="admin-container loading">Loading bookings...</div>
  }

  if (error) {
    return <div className="admin-container error">{error}</div>
  }

  return (
    <div className="admin-bookings-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Manage Bookings</h1>
          <p>View and manage all customer bookings</p>
        </div>

        <div className="admin-actions">
          <form
            className="admin-search"
            onSubmit={(e) => {
              e.preventDefault()
              // If you want to trigger any additional logic on search, do it here
              console.log("Searching for:", searchQuery)
            }}
          >
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>

        <div className="admin-filters">
          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-control">
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-control"
            />
          </div>
          {(statusFilter || dateFilter) && (
            <button
              className="btn btn-outline"
              onClick={() => {
                setStatusFilter("")
                setDateFilter("")
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            {currentBookings.length === 0 ? (
              <div className="no-data">No bookings found</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Movie</th>
                    <th>Theater</th>
                    <th>Show Time</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                    {/* <th>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking._id.substring(0, 8)}</td>
                      <td>
                        <div className="user-info">
                          <div>{booking.userId?.name || "Unknown User"}</div>
                          <div className="user-email">{booking.userId?.email || "No email"}</div>
                        </div>
                      </td>
                      <td>{booking.showId.movieId.title}</td>
                      <td>{booking.showId.theaterId.name}</td>
                      <td>
                        <div>{formatDate(booking.showId.showTime)}</div>
                        <div>{formatTime(booking.showId.showTime)}</div>
                      </td>
                      <td>{booking.seats.map(formatSeat).join(", ")}</td>
                      <td>₹{booking.totalAmount}</td>
                      <td>
                        <span className={`status-badge ${booking.paymentStatus}`}>{booking.paymentStatus}</span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="btn-icon view"
                            title="View Details"
                            onClick={() => window.open(`/booking-details/${booking._id}`, "_blank")}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleCancelBooking(booking._id)}
                            title="Cancel Booking"
                          >
                            <i className="fas fa-times-circle"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                  >
                    {index + 1}
                  </button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBookingsPage
