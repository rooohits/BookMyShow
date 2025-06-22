"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../../utils/api"
// import "./BookingDetailsPage.css"

const BookingDetailsPage = () => {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/api/bookings/${id}`)
        setBooking(res.data.booking)
      } catch (err) {
        setError("Failed to fetch booking details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [id])

  if (loading) {
    return <div className="container loading">Loading booking details...</div>
  }

  if (error || !booking) {
    return <div className="container error">{error || "Booking not found"}</div>
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format seat (e.g., "A1")
  const formatSeat = (seat) => `${seat.row}${seat.number}`

  return (
    <div className="booking-details-page">
      <div className="container">
        <h1 className="page-title">Booking Confirmation</h1>

        <div className="booking-success">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>Booking Successful!</h2>
          <p>Your tickets have been booked successfully.</p>
        </div>

        <div className="booking-details-container">
          <div className="booking-details-card">
            <div className="movie-info">
              <div className="movie-details">
                <h2>{booking.showId.movieId.title}</h2>
                <p>
                  {booking.showId.movieId.certificate} • {booking.showId.movieId.language}
                </p>
                <p>{booking.showId.movieId.duration} min</p>
              </div>
            </div>

            <div className="booking-info">
              <div className="info-group">
                <h3>Theater : </h3>
                <p>{booking.showId.theaterId.name}</p>
                <p>{booking.showId.theaterId.location}</p>
                <p>Screen : {booking.showId.screen}</p>
              </div>

              <div className="info-group">
                <h3>Show Time : </h3>
                <p>{formatDate(booking.showId.showTime)}</p>
                <p>{formatTime(booking.showId.showTime)}</p>
              </div>

              <div className="info-group">
                <h3>Seats : </h3>
                <p>{booking.seats.map(formatSeat).join(", ")}</p>
                <p>{booking.seats.length} seat(s)</p>
              </div>
            </div>

            <div className="booking-summary">
              <div className="summary-row">
                <span>Ticket Price : </span>
                <span>
                  ₹{booking.showId.price} x {booking.seats.length}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total Amount : </span>
                <span>₹{booking.totalAmount}</span>
              </div>
              <div className="summary-row">
                <span>Booking ID : </span>
                <span>{booking._id}</span>
              </div>
              <div className="summary-row">
                <span>Payment Status : </span>
                <span className="payment-status">{booking.paymentStatus}</span>
              </div>
            </div>

            <div className="booking-actions">
              <Link to="/my-bookings" className="btn btn-outline">
                View All Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetailsPage
