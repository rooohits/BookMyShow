import { Link } from "react-router-dom"
import "./TheaterCard.css"

const TheaterCard = ({ theater }) => {
  return (
    <div className="theater-card">
      <div className="theater-info">
        <h3 className="theater-name">{theater.name}</h3>
        <p className="theater-location">{theater.location}</p>
        <p className="theater-address">{theater.address}</p>

        <div className="theater-facilities">
          {theater.facilities.map((facility, index) => (
            <span key={index} className="facility-tag">
              {facility}
            </span>
          ))}
        </div>
      </div>

      <div className="theater-actions">
        <Link to={`/?theaterId=${theater._id}`} className="btn btn-primary">
          View Shows
        </Link>
      </div>
    </div>
  )
}

export default TheaterCard
