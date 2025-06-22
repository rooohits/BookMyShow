"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../utils/api"
import DateSelector from "../components/shows/DateSelector"
import ShowList from "../components/shows/ShowList"
import ReviewForm from "../components/reviews/ReviewForm"
import ReviewList from "../components/reviews/ReviewList"
import "./MovieDetailsPage.css"

const MovieDetailsPage = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Set default date to today
  const today = new Date().toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(today)

  // Fetch movie details and reviews
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)

        const res = await api.get(`/api/movies/${id}`)
        setMovie(res.data.movie)
        setReviews(res.data.reviews)
      } catch (err) {
        setError("Failed to fetch movie details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  // Fetch shows for the movie
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const params = new URLSearchParams()
        params.append("movieId", id)
        params.append("date", selectedDate)

        const res = await api.get(`/api/shows?${params.toString()}`)
        setShows(res.data.shows)
      } catch (err) {
        console.error("Failed to fetch shows:", err)
      }
    }

    if (id) {
      fetchShows()
    }
  }, [id, selectedDate])

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  // Handle review added
  const handleReviewAdded = async () => {
    try {
      const res = await api.get(`/api/reviews/movie/${id}`)
      setReviews(res.data.reviews)

      // Refresh movie to get updated rating
      const movieRes = await api.get(`/api/movies/${id}`)
      setMovie(movieRes.data.movie)
    } catch (err) {
      console.error("Failed to refresh reviews:", err)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return <div className="container loading">Loading movie details...</div>
  }

  if (error || !movie) {
    return <div className="container error">{error || "Movie not found"}</div>
  }

  return (
    <div className="movie-details-page">
      <div className="movie-backdrop" style={{ backgroundImage: `url(${movie.banner})` }}>
        <div className="backdrop-overlay"></div>
      </div>

      <div className="container">
        <div className="movie-details">
          {/* <div className="movie-poster"> */}
          <img src={movie.poster || "/placeholder.svg"} alt={movie.title} />
          {/* </div> */}

          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>

            <div className="movie-meta">
              <div className="movie-rating">
                <i className="fas fa-star"></i>
                <span>{movie.rating.toFixed(1)}</span>
              </div>
              <div className="movie-certificate">{movie.certificate}</div>
              <div className="movie-duration">{movie.duration} min</div>
              <div className="movie-language">{movie.language}</div>
              <div className="movie-genre">{movie.genre}</div>
              <div className="movie-release">Released: {formatDate(movie.releaseDate)}</div>
            </div>

            <div className="movie-description">
              <h3>About the Movie</h3>
              <p>{movie.description}</p>
            </div>

            <div className="movie-cast">
              <h3>Cast</h3>
              <div className="cast-list">
                {movie.cast.map((actor, index) => (
                  <div key={index} className="cast-item">
                    {/* <div className="cast-image">
                      <img src={actor.image || "/placeholder.svg"} alt={actor.name} />
                    </div> */}
                    <div className="cast-name">{actor.name}</div>
                    <div className="cast-role">{actor.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="movie-shows">
          <h2 className="section-title">Shows</h2>

          <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />

          <ShowList shows={shows} date={selectedDate} />
        </div>

        <div className="movie-reviews">
          <ReviewForm movieId={id} onReviewAdded={handleReviewAdded} />
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsPage
