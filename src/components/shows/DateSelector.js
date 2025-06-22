"use client"
import "./DateSelector.css"

const DateSelector = ({ selectedDate, onDateChange }) => {
  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })

  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: "short", day: "numeric", month: "short" }
    return date.toLocaleDateString(undefined, options)
  }

  // Format date for API
  const formatDateForAPI = (date) => {
    return date.toISOString().split("T")[0]
  }

  return (
    <div className="date-selector">
      <h3>Select Date</h3>
      <div className="date-list">
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            className={`date-item ${selectedDate === formatDateForAPI(date) ? "active" : ""}`}
            onClick={() => onDateChange(formatDateForAPI(date))}
          >
            <div className="date-day">{date.getDate()}</div>
            <div className="date-weekday">{date.toLocaleDateString(undefined, { weekday: "short" })}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DateSelector
