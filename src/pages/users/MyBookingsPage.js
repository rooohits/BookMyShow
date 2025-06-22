"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "./MyBookingsPage.css"

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const res = await api.get("/api/bookings/my-bookings")
        setBookings(res.data.bookings)
      } catch (err) {
        setError("Failed to fetch bookings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format seat (e.g., "A1")
  const formatSeat = (seat) => `${seat.row}${seat.number}`

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1 className="page-title">My Bookings</h1>

        {loading ? (
          <div className="loading">Loading bookings...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="empty-state">
              <i className="fas fa-ticket-alt"></i>
              <h2>No Bookings Found</h2>
              <p>You haven't made any bookings yet.</p>
              <Link to="/" className="btn btn-primary">
                Browse Movies
              </Link>
            </div>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="movie-info">
                    <div className="movie-details">
                      <h2>{booking.showId.movieId.title}</h2>
                      <p>
                        {booking.showId.movieId.certificate} • {booking.showId.movieId.language}
                      </p>
                    </div>
                  </div>
                  <div className="booking-status">
                    <span className={`status-badge ${booking.paymentStatus}`}>{booking.paymentStatus}</span>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-group">
                    <h3>Theater : </h3>
                    <p>{booking.showId.theaterId.name}</p>
                    <p>Screen : {booking.showId.screen}</p>
                  </div>

                  <div className="detail-group">
                    <h3>Show Time : </h3>
                    <p>{formatDate(booking.showId.showTime)}</p>
                    <p>{formatTime(booking.showId.showTime)}</p>
                  </div>

                  <div className="detail-group">
                    <h3>Seats : </h3>
                    <p>{booking.seats.map(formatSeat).join(", ")}</p>
                    <p>{booking.seats.length} seat(s)</p>
                  </div>

                  <div className="detail-group">
                    <h3>Amount : </h3>
                    <p className="amount">₹{booking.totalAmount}</p>
                    <p>Booking ID : {booking._id.substring(0, 8)}</p>
                  </div>
                </div>

                <div className="booking-actions">
                  <Link to={`/booking-details/${booking._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookingsPage
