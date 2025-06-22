"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../utils/api"
import "./AdminShowForm.css"

const AdminShowForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    movieId: "",
    theaterId: "",
    screen: "",
    showTime: "",
    price: "",
  })

  const [movies, setMovies] = useState([])
  const [theaters, setTheaters] = useState([])
  const [screens, setScreens] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMoviesAndTheaters()

    if (isEditMode) {
      fetchShowData()
    }
  }, [id])

  const fetchMoviesAndTheaters = async () => {
    try {
      setLoading(true)

      const [moviesRes, theatersRes] = await Promise.all([api.get("/api/movies"), api.get("/api/theaters")])

      setMovies(moviesRes.data.movies)
      setTheaters(theatersRes.data.theaters)
    } catch (err) {
      setError("Failed to fetch movies and theaters")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchShowData = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/shows/${id}`)
      const show = res.data.show

      // Format date and time for input
      const showDateTime = new Date(show.showTime)
      const formattedDate = showDateTime.toISOString().split("T")[0]
      const formattedTime = showDateTime.toTimeString().split(" ")[0].substring(0, 5)

      setFormData({
        movieId: show.movieId._id,
        theaterId: show.theaterId._id,
        screen: show.screen,
        showTime: `${formattedDate}T${formattedTime}`,
        price: show.price,
      })

      // Load screens for the selected theater
      const theatersRes = await api.get("/api/theaters")
      if (show.theaterId._id) {
        const theater = theatersRes.data.theaters.find((t) => t._id === show.theaterId._id)
        if (theater) {
          setScreens(theater.screens || [])
        }
      }
    } catch (err) {
      setError("Failed to fetch show data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    // If theater changes, update available screens
    if (name === "theaterId" && value) {
      const selectedTheater = theaters.find((theater) => theater._id === value)
      setScreens(selectedTheater ? selectedTheater.screens : [])

      // Reset screen selection
      setFormData((prev) => ({
        ...prev,
        screen: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      if (isEditMode) {
        await api.put(`/api/shows/${id}`, formData)
      } else {
        await api.post("/api/shows", formData)
      }

      navigate("/admin/shows")
    } catch (err) {
      setError("Failed to save show")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditMode) {
    return <div className="loading">Loading show data...</div>
  }

  return (
    <div className="admin-show-form">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{isEditMode ? "Edit Show" : "Add New Show"}</h2>
        </div>
        <div className="admin-card-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="movieId">Movie</label>
              <select
                id="movieId"
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="theaterId">Theater</label>
              <select
                id="theaterId"
                name="theaterId"
                value={formData.theaterId}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select a theater</option>
                {theaters.map((theater) => (
                  <option key={theater._id} value={theater._id}>
                    {theater.name} - {theater.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="screen">Screen</label>
              <select
                id="screen"
                name="screen"
                value={formData.screen}
                onChange={handleChange}
                className="form-control"
                required
                disabled={!formData.theaterId}
              >
                <option value="">Select a screen</option>
                {screens.map((screen, index) => (
                  <option key={index} value={screen.name}>
                    {screen.name} ({screen.capacity} seats)
                  </option>
                ))}
              </select>
              {!formData.theaterId && <p className="form-hint">Select a theater first</p>}
            </div>

            <div className="form-group">
              <label htmlFor="showTime">Show Date & Time</label>
              <input
                type="datetime-local"
                id="showTime"
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Ticket Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                min="1"
                step="1"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate("/admin/shows")} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : isEditMode ? "Update Show" : "Add Show"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminShowForm