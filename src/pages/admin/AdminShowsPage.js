"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "./AdminPages.css"

const AdminShowsPage = () => {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredShows, setFilteredShows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showsPerPage] = useState(10)
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true)
        const res = await api.get("/api/shows")
        setShows(res.data.shows)
        setFilteredShows(res.data.shows)
      } catch (err) {
        setError("Failed to fetch shows")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [])

  // Handle search and filter
  useEffect(() => {
    let filtered = shows

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter((show) => {
        const showDate = new Date(show.showTime)
        return (
          showDate.getDate() === filterDate.getDate() &&
          showDate.getMonth() === filterDate.getMonth() &&
          showDate.getFullYear() === filterDate.getFullYear()
        )
      })
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (show) =>
          show.movieId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          show.theaterId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          show.screen.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredShows(filtered)
    setCurrentPage(1)
  }, [searchQuery, dateFilter, shows])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Handle show delete
  const handleDeleteShow = async (showId) => {
    if (window.confirm("Are you sure you want to delete this show?")) {
      try {
        await api.delete(`/api/shows/${showId}`)

        // Update local state
        setShows(shows.filter((show) => show._id !== showId))
        setFilteredShows(filteredShows.filter((show) => show._id !== showId))
      } catch (err) {
        console.error("Failed to delete show:", err)
      }
    }
  }

  // Pagination
  const indexOfLastShow = currentPage * showsPerPage
  const indexOfFirstShow = indexOfLastShow - showsPerPage
  const currentShows = filteredShows.slice(indexOfFirstShow, indexOfLastShow)
  const totalPages = Math.ceil(filteredShows.length / showsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return <div className="admin-container loading">Loading shows...</div>
  }

  if (error) {
    return <div className="admin-container error">{error}</div>
  }

  return (
    <div className="admin-shows-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Manage Shows</h1>
          <p>Add, edit, or remove movie shows from the system</p>
        </div>

        <div className="admin-actions">
          <div className="admin-search">
            <input
              type="text"
              placeholder="Search shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <Link to="/admin/shows/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add New Show
          </Link>
        </div>

        <div className="admin-filters">
          <div className="filter-group">
            <label>Filter by Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-control"
            />
          </div>
          {dateFilter && (
            <button className="btn btn-outline" onClick={() => setDateFilter("")}>
              Clear Filter
            </button>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            {currentShows.length === 0 ? (
              <div className="no-data">No shows found</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Movie</th>
                    <th>Theater</th>
                    <th>Screen</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Available Seats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentShows.map((show) => (
                    <tr key={show._id}>
                      <td>{show.movieId.title}</td>
                      <td>{show.theaterId.name}</td>
                      <td>{show.screen}</td>
                      <td>{formatDate(show.showTime)}</td>
                      <td>{formatTime(show.showTime)}</td>
                      <td>₹{show.price}</td>
                      <td>
                        {show.availableSeats.length - show.bookedSeats.length} / {show.availableSeats.length}
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <Link to={`/admin/shows/edit/${show._id}`} className="btn-icon" title="Edit">
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button className="btn-icon delete" onClick={() => handleDeleteShow(show._id)} title="Delete">
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

export default AdminShowsPage
