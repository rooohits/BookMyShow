"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "./AdminPages.css"

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMovies, setFilteredMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [moviesPerPage] = useState(10)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const res = await api.get("/api/movies")
        setMovies(res.data.movies)
        setFilteredMovies(res.data.movies)
      } catch (err) {
        setError("Failed to fetch movies")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMovies(movies)
    } else {
      const filtered = movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.language.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredMovies(filtered)
    }
    setCurrentPage(1)
  }, [searchQuery, movies])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Handle movie status toggle
  const handleToggleStatus = async (movieId, currentStatus) => {
    try {
      await api.patch(`/api/movies/${movieId}/toggle`)

      // Update local state
      setMovies(movies.map((movie) => (movie._id === movieId ? { ...movie, isActive: !currentStatus } : movie)))

      setFilteredMovies(
        filteredMovies.map((movie) => (movie._id === movieId ? { ...movie, isActive: !currentStatus } : movie)),
      )
    } catch (err) {
      console.error("Failed to toggle movie status:", err)
    }
  }

  // Handle movie delete
  const handleDeleteMovie = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await api.delete(`/api/movies/${movieId}`)

        // Update local state
        setMovies(movies.filter((movie) => movie._id !== movieId))
        setFilteredMovies(filteredMovies.filter((movie) => movie._id !== movieId))
      } catch (err) {
        console.error("Failed to delete movie:", err)
      }
    }
  }

  // Pagination
  const indexOfLastMovie = currentPage * moviesPerPage
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie)
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return <div className="admin-container loading">Loading movies...</div>
  }

  if (error) {
    return <div className="admin-container error">{error}</div>
  }

  return (
    <div className="admin-movies-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Manage Movies</h1>
          <p>Add, edit, or remove movies from the system</p>
        </div>

        <div className="admin-actions">
          <div className="admin-search">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <Link to="/admin/movies/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add New Movie
          </Link>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            {currentMovies.length === 0 ? (
              <div className="no-data">No movies found</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Poster</th>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Language</th>
                    <th>Release Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMovies.map((movie) => (
                    <tr key={movie._id}>
                      <td>
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="admin-thumbnail"
                          width="50"
                        />
                      </td>
                      <td>{movie.title}</td>
                      <td>{movie.genre}</td>
                      <td>{movie.language}</td>
                      <td>{formatDate(movie.releaseDate)}</td>
                      <td>
                        <span className={`status-badge ${movie.isActive ? "completed" : "failed"}`}>
                          {movie.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="btn-icon"
                            onClick={() => handleToggleStatus(movie._id, movie.isActive)}
                            title={movie.isActive ? "Deactivate" : "Activate"}
                          >
                            <i className={`fas ${movie.isActive ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
                          </button>
                          <Link to={`/admin/movies/edit/${movie._id}`} className="btn-icon" title="Edit">
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteMovie(movie._id)}
                            title="Delete"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                  >
                    {index + 1}
                  </button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminMoviesPage
