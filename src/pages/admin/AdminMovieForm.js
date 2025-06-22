"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../utils/api"
import './AdminPages.css'
import "./AdminMovieForm.css"

const AdminMovieForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    language: "",
    duration: "",
    certificate: "",
    releaseDate: "",
    poster: "",
    banner: "",
    cast: "",
    isActive: true,
    allowEdits: true,
  })

  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEditMode) {
      const fetchMovie = async () => {
        try {
          setLoading(true)
          const res = await api.get(`/api/movies/${id}`)
          const movie = res.data.movie

          // Format date for input
          const releaseDate = new Date(movie.releaseDate).toISOString().split("T")[0]

          setFormData({
            title: movie.title,
            description: movie.description,
            genre: movie.genre,
            language: movie.language,
            duration: movie.duration,
            certificate: movie.certificate,
            releaseDate,
            poster: movie.poster,
            banner: movie.banner,
            cast: Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast,
            isActive: movie.isActive,
            allowEdits: movie.allowEdits || true,
          })
        } catch (err) {
          console.error("Failed to fetch movie:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchMovie()
    }
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
  
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}
    const allowedLanguages = ["English", "Hindi", "Bengali", "Tamil", "Telugu", "Kannada", "Marathi"];

    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }

    if (!formData.genre.trim()) {
      errors.genre = "Genre is required"
    }

    if (!formData.language.trim()) {
      errors.language = "Language is required";
    } else if (!allowedLanguages.includes(formData.language.trim())) {
      errors.language = "Please select a valid language";
    }

    if (!formData.duration.trim()) {
      errors.duration = "Duration is required"
    } else if (!/^\d+$/.test(formData.duration)) {
      errors.duration = "Duration must be a number (in minutes)"
    }

    if (!formData.certificate.trim()) {
      errors.certificate = "Certificate is required"
    }

    if (!formData.releaseDate) {
      errors.releaseDate = "Release date is required"
    }

    if (!formData.poster.trim()) {
      errors.poster = "Poster URL is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

 const handleSubmit = async (e) => {
  e.preventDefault()

  if (validateForm()) {
    try {
      setSubmitting(true)

      // Format cast as array of objects
      const formattedData = {
        ...formData,
        cast: formData.cast
          .split(",")
          .map((item) => ({ name: item.trim() })),
      }

      console.log("Submitting movie data:", formattedData) // Optional: debug log

      if (isEditMode) {
        await api.put(`/api/movies/${id}`, formattedData)
      } else {
        await api.post("/api/movies", formattedData)
      }

      navigate("/admin/movies")
    } catch (err) {
      console.error("Failed to save movie:", err)
      setFormErrors({
        ...formErrors,
        general: err.response?.data?.message || "Failed to save movie",
      })
    } finally {
      setSubmitting(false)
    }
  }
}

  if (loading) {
    return <div className="admin-container loading">Loading movie data...</div>
  }

  return (
    <div className="admin-movie-form-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>{isEditMode ? "Edit Movie" : "Add New Movie"}</h1>
          <p>{isEditMode ? "Update movie information" : "Create a new movie in the system"}</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            {formErrors.general && <div className="alert alert-error">{formErrors.general}</div>}

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Movie Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`form-control ${formErrors.title ? "error" : ""}`}
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {formErrors.title && <div className="form-error">{formErrors.title}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="releaseDate" className="form-label">
                    Release Date
                  </label>
                  <input
                    type="date"
                    id="releaseDate"
                    name="releaseDate"
                    className={`form-control ${formErrors.releaseDate ? "error" : ""}`}
                    value={formData.releaseDate}
                    onChange={handleChange}
                  />
                  {formErrors.releaseDate && <div className="form-error">{formErrors.releaseDate}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="genre" className="form-label">
                    Genre
                  </label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    className={`form-control ${formErrors.genre ? "error" : ""}`}
                    value={formData.genre}
                    onChange={handleChange}
                    placeholder="e.g. Action, Drama, Comedy"
                  />
                  {formErrors.genre && <div className="form-error">{formErrors.genre}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="language" className="form-label">
                    Language
                  </label>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    className={`form-control ${formErrors.language ? "error" : ""}`}
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="e.g. English, Hindi, Tamil"
                  />
                  {formErrors.language && <div className="form-error">{formErrors.language}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="duration" className="form-label">
                    Duration (minutes)
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    className={`form-control ${formErrors.duration ? "error" : ""}`}
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 120"
                  />
                  {formErrors.duration && <div className="form-error">{formErrors.duration}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="certificate" className="form-label">
                    Certificate
                  </label>
                  <input
                    type="text"
                    id="certificate"
                    name="certificate"
                    className={`form-control ${formErrors.certificate ? "error" : ""}`}
                    value={formData.certificate}
                    onChange={handleChange}
                    placeholder="e.g. U, U/A, A"
                  />
                  {formErrors.certificate && <div className="form-error">{formErrors.certificate}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="poster" className="form-label">
                    Poster URL
                  </label>
                  <input
                    type="text"
                    id="poster"
                    name="poster"
                    className={`form-control ${formErrors.poster ? "error" : ""}`}
                    value={formData.poster}
                    onChange={handleChange}
                    placeholder="https://example.com/poster.jpg"
                  />
                  {formErrors.poster && <div className="form-error">{formErrors.poster}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="banner" className="form-label">
                    Banner URL
                  </label>
                  <input
                    type="text"
                    id="banner"
                    name="banner"
                    className={`form-control ${formErrors.banner ? "error" : ""}`}
                    value={formData.banner}
                    onChange={handleChange}
                    placeholder="https://example.com/banner.jpg"
                  />
                  {formErrors.banner && <div className="form-error">{formErrors.banner}</div>}
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  className={`form-control ${formErrors.description ? "error" : ""}`}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter movie description"
                ></textarea>
                {formErrors.description && <div className="form-error">{formErrors.description}</div>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="cast" className="form-label">
                  Cast (comma separated)
                </label>
                <textarea
                  id="cast"
                  name="cast"
                  rows="2"
                  className={`form-control ${formErrors.cast ? "error" : ""}`}
                  value={formData.cast}
                  onChange={handleChange}
                  placeholder="e.g. Actor 1, Actor 2, Actor 3"
                ></textarea>
                {formErrors.cast && <div className="form-error">{formErrors.cast}</div>}
              </div>

              <div className="admin-form-actions">
                <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/movies")}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  
                  Add Movie
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminMovieForm