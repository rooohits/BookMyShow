"use client"
import "./BookingSummary.css"

const BookingSummary = ({ show, selectedSeats, onProceed }) => {
  if (!show) return null

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

  // Calculate total amount
  const totalAmount = selectedSeats.length * show.price

  return (
    <div className="booking-summary">
      <h3>Booking Summary</h3>

      <div className="summary-details">
        <div className="show-details">
          <div className="detail-item">
            <span className="detail-label">Theater:</span>
            <span className="detail-value">{show.theaterId.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Screen:</span>
            <span className="detail-value">{show.screen}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{formatDate(show.showTime)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Time:</span>
            <span className="detail-value">{formatTime(show.showTime)}</span>
          </div>
        </div>

        <div className="seat-details">
          <div className="detail-item">
            <span className="detail-label">Selected Seats:</span>
            <span className="detail-value">
              {selectedSeats.length > 0 ? selectedSeats.map(formatSeat).join(", ") : "None selected"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Ticket Price:</span>
            <span className="detail-value">
              ₹{show.price} x {selectedSeats.length}
            </span>
          </div>
        </div>

        <div className="total-amount">
          <span className="detail-label">Total Amount:</span>
          <span className="detail-value">₹{totalAmount}</span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-block"
        disabled={selectedSeats.length === 0}
        onClick={() => onProceed(totalAmount)}
      >
        Proceed to Payment
      </button>
    </div>
  )
}

export default BookingSummary
