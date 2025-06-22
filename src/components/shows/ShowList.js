import { Link } from "react-router-dom"
import "./ShowList.css"

const ShowList = ({ shows, date }) => {
  if (!shows || shows.length === 0) {
    return (
      <div className="show-list">
        <div className="no-shows">No shows available for this date</div>
      </div>
    )
  }

  // Group shows by theater
  const groupedShows = shows.reduce((acc, show) => {
    const theaterId = show.theaterId._id

    if (!acc[theaterId]) {
      acc[theaterId] = {
        theater: show.theaterId,
        shows: [],
      }
    }

    acc[theaterId].shows.push(show)
    return acc
  }, {})

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="show-list">
      {Object.values(groupedShows).map((group) => (
        <div key={group.theater._id} className="theater-shows">
          <div className="theater-info">
            <h3>{group.theater.name}</h3>
            <p>{group.theater.location}</p>
          </div>

          <div className="show-times">
            {group.shows.map((show) => (
              <Link key={show._id} to={`/booking/${show._id}`} className="show-time-btn">
                {formatTime(show.showTime)}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShowList
