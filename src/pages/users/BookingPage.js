"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../utils/api"
import SeatLayout from "../../components/booking/SeatLayout"
import BookingSummary from "../../components/booking/BookingSummary"
import "./BookingPage.css"

const BookingPage = () => {
  const { showId } = useParams()
  const navigate = useNavigate()

  const [show, setShow] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [, setBookingInProgress] = useState(false)

  // Fetch show details
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/api/shows/${showId}`)
        setShow(res.data.show)
      } catch (err) {
        setError("Failed to fetch show details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchShowDetails()
  }, [showId])

  // Handle seat selection
  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats)
  }

  // Handle booking
  const handleProceedToPayment = async (totalAmount) => {
    try {
      setBookingInProgress(true)

      // Create booking
      const res = await api.post("/api/bookings", {
        showId,
        seats: selectedSeats,
        totalAmount,
      })

      // Redirect to booking details page
      navigate(`/booking-details/${res.data.booking._id}`)
    } catch (err) {
      if (err.response && err.response.data.unavailableSeats) {
        setError(`Some seats are no longer available: ${err.response.data.unavailableSeats.join(", ")}`)
      } else {
        setError("Failed to create booking")
      }
      console.error(err)
      setBookingInProgress(false)
    }
  }

  if (loading) {
    return <div className="container loading">Loading show details...</div>
  }

  if (error || !show) {
    return <div className="container error">{error || "Show not found"}</div>
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Select Seats</h1>

        <div className="movie-info-bar">
            <h2>{show.movieId.title}</h2>
            <p>
              {show.movieId.certificate} • {show.movieId.language} • {show.movieId.genre}
            </p>
            <p>
              <strong>{show.theaterId.name}</strong> - {show.screen}
            </p>
            <p>
              <strong>Show Time:</strong> {new Date(show.showTime).toLocaleString()}
            </p>
        </div>

        {error && <div className="alert alert-error mb-3">{error}</div>}

        <div className="booking-container">
          <div className="seat-selection">
            <SeatLayout
              availableSeats={show.availableSeats}
              bookedSeats={show.bookedSeats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </div>

          <div className="booking-summary-container">
            <BookingSummary show={show} selectedSeats={selectedSeats} onProceed={handleProceedToPayment} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
