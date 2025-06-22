"use client"

import { useState, useEffect } from "react"
import "./AdminPages.css"

const AdminMovieSuggestions = () => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [suggestionsPerPage] = useState(10)

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        // In a real app, you would have an API endpoint for movie suggestions
        // For now, we'll simulate with mock data
        const mockSuggestions = [
          {
            _id: "1",
            title: "The Matrix Resurrections",
            description: "The fourth installment in The Matrix franchise.",
            genre: "Sci-Fi",
            language: "English",
            suggestedBy: {
              _id: "user1",
              name: "John Doe",
              email: "john@example.com",
            },
            status: "pending",
            createdAt: new Date("2023-01-15"),
          },
          {
            _id: "2",
            title: "Dune: Part Two",
            description: "The second part of the Dune adaptation.",
            genre: "Sci-Fi",
            language: "English",
            suggestedBy: {
              _id: "user2",
              name: "Jane Smith",
              email: "jane@example.com",
            },
            status: "approved",
            createdAt: new Date("2023-02-10"),
          },
          {
            _id: "3",
            title: "Oppenheimer",
            description: "A biographical film about J. Robert Oppenheimer.",
            genre: "Drama",
            language: "English",
            suggestedBy: {
              _id: "user3",
              name: "Mike Johnson",
              email: "mike@example.com",
            },
            status: "rejected",
            createdAt: new Date("2023-03-05"),
          },
        ]

        setSuggestions(mockSuggestions)
      } catch (err) {
        setError("Failed to fetch movie suggestions")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Handle approve suggestion
  const handleApproveSuggestion = async (suggestionId) => {
    try {
      // In a real app, you would call an API endpoint
      // await api.post(`/api/movie-suggestions/${suggestionId}/approve`)

      // Update local state
      setSuggestions(
        suggestions.map((suggestion) =>
          suggestion._id === suggestionId ? { ...suggestion, status: "approved" } : suggestion,
        ),
      )
    } catch (err) {
      console.error("Failed to approve suggestion:", err)
    }
  }

  // Handle reject suggestion
  const handleRejectSuggestion = async (suggestionId) => {
    try {
      // In a real app, you would call an API endpoint
      // await api.post(`/api/movie-suggestions/${suggestionId}/reject`)

      // Update local state
      setSuggestions(
        suggestions.map((suggestion) =>
          suggestion._id === suggestionId ? { ...suggestion, status: "rejected" } : suggestion,
        ),
      )
    } catch (err) {
      console.error("Failed to reject suggestion:", err)
    }
  }

  // Pagination
  const indexOfLastSuggestion = currentPage * suggestionsPerPage
  const indexOfFirstSuggestion = indexOfLastSuggestion - suggestionsPerPage
  const currentSuggestions = suggestions.slice(indexOfFirstSuggestion, indexOfLastSuggestion)
  const totalPages = Math.ceil(suggestions.length / suggestionsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return <div className="admin-container loading">Loading movie suggestions...</div>
  }

  if (error) {
    return <div className="admin-container error">{error}</div>
  }

  return (
    <div className="admin-movie-suggestions-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Movie Suggestions</h1>
          <p>Review and manage movie suggestions from users</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            {currentSuggestions.length === 0 ? (
              <div className="no-data">No movie suggestions found</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Language</th>
                    <th>Suggested By</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSuggestions.map((suggestion) => (
                    <tr key={suggestion._id}>
                      <td>{suggestion.title}</td>
                      <td>{suggestion.genre}</td>
                      <td>{suggestion.language}</td>
                      <td>
                        <div className="user-info">
                          <div>{suggestion.suggestedBy.name}</div>
                          <div className="user-email">{suggestion.suggestedBy.email}</div>
                        </div>
                      </td>
                      <td>{formatDate(suggestion.createdAt)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            suggestion.status === "approved"
                              ? "completed"
                              : suggestion.status === "rejected"
                                ? "failed"
                                : "pending"
                          }`}
                        >
                          {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          {suggestion.status === "pending" && (
                            <>
                              <button
                                className="btn-icon approve"
                                onClick={() => handleApproveSuggestion(suggestion._id)}
                                title="Approve"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn-icon reject"
                                onClick={() => handleRejectSuggestion(suggestion._id)}
                                title="Reject"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                          <button
                            className="btn-icon view"
                            title="View Details"
                            onClick={() => alert(`Description: ${suggestion.description}`)}
                          >
                            <i className="fas fa-eye"></i>
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

export default AdminMovieSuggestions