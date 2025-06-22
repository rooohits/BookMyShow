import MovieCard from "./MovieCard"
import "./MovieList.css"

const MovieList = ({ movies, title }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-list">
        <h2 className="section-title">{title}</h2>
        <div className="no-movies">No movies found</div>
      </div>
    )
  }

  return (
    <div className="movie-list">
      <h2 className="section-title">{title}</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default MovieList
