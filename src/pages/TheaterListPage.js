"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"
import TheaterCard from "../components/theaters/TheaterCard"
import "./TheaterListPage.css"

const TheaterListPage = () => {
  const [theaters, setTheaters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true)
        const res = await api.get("/api/theaters")
        setTheaters(res.data.theaters)
      } catch (err) {
        setError("Failed to fetch theaters")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTheaters()
  }, [])

  return (
    <div className="theater-list-page">
      <div className="container">
        <h1 className="page-title">Theaters</h1>

        {loading ? (
          <div className="loading">Loading theaters...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : theaters.length === 0 ? (
          <div className="no-theaters">No theaters found</div>
        ) : (
          <div className="theater-list">
            {theaters.map((theater) => (
              <TheaterCard key={theater._id} theater={theater} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TheaterListPage
