"use client"
import "./SeatLayout.css"

const SeatLayout = ({ availableSeats, bookedSeats, selectedSeats, onSeatSelect }) => {
  // Get all unique rows
  const allSeats = [...availableSeats, ...bookedSeats]
  const rows = [...new Set(allSeats.map((seat) => seat.row))].sort()

  // Get max seat number
  const maxSeatNumber = Math.max(...allSeats.map((seat) => seat.number))

  // Check if a seat is booked
  const isSeatBooked = (row, number) => {
    return bookedSeats.some((seat) => seat.row === row && seat.number === number)
  }

  // Check if a seat is selected
  const isSeatSelected = (row, number) => {
    return selectedSeats.some((seat) => seat.row === row && seat.number === number)
  }

  // Check if a seat exists
  const seatExists = (row, number) => {
    return allSeats.some((seat) => seat.row === row && seat.number === number)
  }

  // Handle seat click
  const handleSeatClick = (row, number) => {
    if (isSeatBooked(row, number)) return

    const seat = { row, number }

    if (isSeatSelected(row, number)) {
      // Remove seat from selection
      const updatedSeats = selectedSeats.filter((s) => !(s.row === row && s.number === number))
      onSeatSelect(updatedSeats)
    } else {
      // Add seat to selection
      onSeatSelect([...selectedSeats, seat])
    }
  }

  return (
    <div className="seat-layout">
      <div className="screen-container">
        <div className="screen"></div>
        <p>Screen</p>
      </div>

      <div className="seats-container">
        {rows.map((row) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            <div className="seats">
              {Array.from({ length: maxSeatNumber }, (_, i) => i + 1).map((number) => {
                if (!seatExists(row, number)) {
                  return <div key={`${row}${number}`} className="seat-spacer"></div>
                }

                const isBooked = isSeatBooked(row, number)
                const isSelected = isSeatSelected(row, number)

                return (
                  <div
                    key={`${row}${number}`}
                    className={`seat ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSeatClick(row, number)}
                  >
                    {number}
                  </div>
                )
              })}
            </div>
            <div className="row-label">{row}</div>
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  )
}

export default SeatLayout
