import { Link } from "react-router-dom"
import "./MovieCard.css"

const MovieCard = ({ movie }) => {
  console.log("MovieCard received:", movie)
  return (
    <Link to={`/movie/${movie._id}`} className="movie-card-link">
      <div className="movie-card">
        
          <img src={movie.poster || "/placeholder.svg"} alt={movie.title} />
          
        
        <div className="movie-info">
          <p className="movie-title" style={{fontSize:"18px"}}>{movie.title}</p>
          <p className="movie-genre">{movie.genre}</p>
        </div>
        
      </div>
    </Link>
  )
}


export default MovieCard
