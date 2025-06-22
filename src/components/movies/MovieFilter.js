"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./MovieFilter.css"

const MovieFilter = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [filters, setFilters] = useState({
    genre: queryParams.get("genre") || "",
    language: queryParams.get("language") || "",
    sort: queryParams.get("sort") || "releaseDate",
  })

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Sport",
    "Thriller",
    "War",
  ]

  const languages = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Kannada",
    "Bengali",
    "Marathi",
    "Punjabi",
    "Gujarati",
  ]

  const sortOptions = [
    { value: "releaseDate", label: "Release Date (Newest)" },
    { value: "-releaseDate", label: "Release Date (Oldest)" },
    { value: "rating", label: "Rating (Highest)" },
    { value: "-rating", label: "Rating (Lowest)" },
    { value: "title", label: "Title (A-Z)" },
    { value: "-title", label: "Title (Z-A)" },
  ]

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.genre) {
      params.set("genre", filters.genre)
    }

    if (filters.language) {
      params.set("language", filters.language)
    }

    if (filters.sort) {
      params.set("sort", filters.sort)
    }

    // Preserve search query if exists
    const search = queryParams.get("search")
    if (search) {
      params.set("search", search)
    }

    navigate(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    // Preserve only search query if exists
    const search = queryParams.get("search")
    if (search) {
      navigate(`/?search=${search}`)
    } else {
      navigate("/")
    }

    setFilters({
      genre: "",
      language: "",
      sort: "releaseDate",
    })
  }

  // Update filters when URL changes
  useEffect(() => {
    setFilters({
      genre: queryParams.get("genre") || "",
      language: queryParams.get("language") || "",
      sort: queryParams.get("sort") || "releaseDate",
    })
  }, [location.search])

  return (
    <div className="movie-filter">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Genre</label>
        <select name="genre" value={filters.genre} onChange={handleFilterChange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Language</label>
        <select name="language" value={filters.language} onChange={handleFilterChange}>
          <option value="">All Languages</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-actions">
        <button className="btn btn-primary" onClick={applyFilters}>
          Apply Filters
        </button>
        <button className="btn btn-outline" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default MovieFilter
