"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "./AdminPages.css"

const AdminTheatersPage = () => {
  const [theaters, setTheaters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTheaters, setFilteredTheaters] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [theatersPerPage] = useState(10)

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true)
        const res = await api.get("/api/theaters")
        setTheaters(res.data.theaters)
        setFilteredTheaters(res.data.theaters)
      } catch (err) {
        setError("Failed to fetch theaters")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTheaters()
  }, [])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTheaters(theaters)
    } else {
      const filtered = theaters.filter(
        (theater) =>
          theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          theater.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          theater.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTheaters(filtered)
    }
    setCurrentPage(1)
  }, [searchQuery, theaters])

  // Handle theater delete
  const handleDeleteTheater = async (theaterId) => {
    if (window.confirm("Are you sure you want to delete this theater?")) {
      try {
        await api.delete(`/api/theaters/${theaterId}`)

        // Update local state
        setTheaters(theaters.filter((theater) => theater._id !== theaterId))
        setFilteredTheaters(filteredTheaters.filter((theater) => theater._id !== theaterId))
      } catch (err) {
        console.error("Failed to delete theater:", err)
      }
    }
  }

  // Pagination
  const indexOfLastTheater = currentPage * theatersPerPage
  const indexOfFirstTheater = indexOfLastTheater - theatersPerPage
  const currentTheaters = filteredTheaters.slice(indexOfFirstTheater, indexOfLastTheater)
  const totalPages = Math.ceil(filteredTheaters.length / theatersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return <div className="admin-container loading">Loading theaters...</div>
  }

  if (error) {
    return <div className="admin-container error">{error}</div>
  }

  return (
    <div className="admin-theaters-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Manage Theaters</h1>
          <p>Add, edit, or remove theaters from the system</p>
        </div>

        <div className="admin-actions">
          <div className="admin-search">
            <input
              type="text"
              placeholder="Search theaters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <Link to="/admin/theaters/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add New Theater
          </Link>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            {currentTheaters.length === 0 ? (
              <div className="no-data">No theaters found</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Address</th>
                    <th>Screens</th>
                    <th>Facilities</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTheaters.map((theater) => (
                    <tr key={theater._id}>
                      <td>{theater.name}</td>
                      <td>{theater.location}</td>
                      <td>{theater.address}</td>
                      <td>{theater.screens.length}</td>
                      <td>
                        <div className="facilities-list">
                          {theater.facilities.slice(0, 3).map((facility, index) => (
                            <span key={index} className="facility-tag">
                              {facility}
                            </span>
                          ))}
                          {theater.facilities.length > 3 && (
                            <span className="facility-tag">+{theater.facilities.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <Link to={`/admin/theaters/edit/${theater._id}`} className="btn-icon" title="Edit">
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteTheater(theater._id)}
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

export default AdminTheatersPage
