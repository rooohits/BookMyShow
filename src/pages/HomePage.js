"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import api from "../utils/api"
import MovieList from "../components/movies/MovieList"
import MovieFilter from "../components/movies/MovieFilter"
import DateSelector from "../components/shows/DateSelector"
import ShowList from "../components/shows/ShowList"
import "./HomePage.css"
import image from "../assets/images/banner.jpg"

const HomePage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [movies, setMovies] = useState([])
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get search parameters
  const search = queryParams.get("search")
  const genre = queryParams.get("genre")
  const language = queryParams.get("language")
  const sort = queryParams.get("sort")
  const theaterId = queryParams.get("theaterId")

  // Set default date to today
  const today = new Date().toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(today)

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        // Build query string
        const params = new URLSearchParams()
        if (search) params.append("search", search)
        if (genre) params.append("genre", genre)
        if (language) params.append("language", language)
        if (sort) params.append("sort", sort)

        const res = await api.get(`/api/movies?${params.toString()}`)
        setMovies(res.data.movies)
      } catch (err) {
        setError("Failed to fetch movies")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [search, genre, language, sort])

  // Fetch shows if theaterId is provided
  useEffect(() => {
    const fetchShows = async () => {
      if (!theaterId) {
        setShows([])
        return
      }

      try {
        setLoading(true)

        const params = new URLSearchParams()
        params.append("theaterId", theaterId)
        params.append("date", selectedDate)

        const res = await api.get(`/api/shows?${params.toString()}`)
        setShows(res.data.shows)
      } catch (err) {
        setError("Failed to fetch shows")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [theaterId, selectedDate])

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  return (
    <div className="home-page">
      <div className="container">
        {/* Banner */}
        <div className="banner">
          <img src={image} alt="Banner" />
        </div>

        {/* Shows Section (if theaterId is provided) */}
        {theaterId && (
          <div className="shows-section">
            <h2 className="section-title">Movie Shows</h2>

            <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />

            {loading ? (
              <div className="loading">Loading shows...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <ShowList shows={shows} date={selectedDate} />
            )}
          </div>
        )}

        {/* Movies Section */}
        {!theaterId && (
          <div className="movies-section">
            <div className="movies-container">
              <div className="sidebar">
                <MovieFilter />
              </div>

              <div className="main-content">
                {loading ? (
                  <div className="loading">Loading movies...</div>
                ) : error ? (
                  <div className="error">{error}</div>
                ) : (
                  <MovieList movies={movies} title={search ? `Search Results for "${search}"` : "Movies"} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
