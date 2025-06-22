"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "./AdminPages.css"

const AdminMovieList = () => {
  const [movies, setMovies] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [language, setLanguage] = useState("")
  const [genres, setGenres] = useState([])
  const [languages, setLanguages] = useState([])
  const [page, setPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/movies")
        const data = res.data.movies
        setMovies(data)
        setGenres([...new Set(data.map(m => m.genre))])
        setLanguages([...new Set(data.map(m => m.language))])
      } catch {
        console.error("Failed to fetch movies")
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    let results = movies
    if (genre) results = results.filter(m => m.genre === genre)
    if (language) results = results.filter(m => m.language === language)
    if (search.trim())
      results = results.filter(m =>
        [m.title, m.genre, m.language].some(field =>
          field.toLowerCase().includes(search.toLowerCase())
        )
      )
    setFiltered(results)
    setPage(1)
  }, [search, genre, language, movies])

  const formatDate = date =>
    new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })

  const current = filtered.slice((page - 1) * perPage, page * perPage)
  const pages = Math.ceil(filtered.length / perPage)

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
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary"><i className="fas fa-search"></i>Search</button>
          </div>
          <Link to="/admin/movies/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add New Movie
          </Link>
        </div>

        <div className="admin-filters">
          <div className="filter-group">
            <label>Genre:</label>
            <select value={genre} onChange={e => setGenre(e.target.value)} className="form-control">
              <option value="">All Genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Language:</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="form-control">
              <option value="">All Languages</option>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {(genre || language) && (
            <button className="btn btn-outline" onClick={() => { setGenre(""); setLanguage(""); }}>
              Clear Filters
            </button>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            {current.length === 0 ? (
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
                  </tr>
                </thead>
                <tbody>
                  {current.map(movie => (
                    <tr key={movie._id}>
                      <td><img src={movie.poster || "/placeholder.svg"} alt={movie.title} width="50" className="admin-thumbnail" /></td>
                      <td>{movie.title}</td>
                      <td>{movie.genre}</td>
                      <td>{movie.language}</td>
                      <td>{formatDate(movie.releaseDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {pages > 1 && (
              <div className="admin-pagination">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <i className="fas fa-chevron-left"></i>&lt;
                </button>
                {Array.from({ length: pages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={page === i + 1 ? "active" : ""}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>
                  <i className="fas fa-chevron-right"></i>&gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminMovieList
