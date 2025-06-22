"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../utils/api"
import "./AdminTheaterForm.css"

const AdminTheaterForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    facilities: [],
    screens: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [facilityInput, setFacilityInput] = useState("")
  const [screenData, setScreenData] = useState({
    name: "",
    capacity: "",
    rows: "",
    columns: "",
  })

  useEffect(() => {
    if (isEditMode) {
      fetchTheaterData()
    }
  }, [id])

  const fetchTheaterData = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/theaters/${id}`)
      const theater = res.data.theater

      setFormData({
        name: theater.name,
        location: theater.location,
        address: theater.address,
        facilities: theater.facilities || [],
        screens: theater.screens || [],
      })
    } catch (err) {
      setError("Failed to fetch theater data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleScreenDataChange = (e) => {
    setScreenData({
      ...screenData,
      [e.target.name]: e.target.value,
    })
  }

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput.trim()],
      })
      setFacilityInput("")
    }
  }

  const removeFacility = (index) => {
    const updatedFacilities = [...formData.facilities]
    updatedFacilities.splice(index, 1)
    setFormData({
      ...formData,
      facilities: updatedFacilities,
    })
  }

  const addScreen = () => {
    if (screenData.name && screenData.capacity && screenData.rows && screenData.columns) {
      const newScreen = {
        name: screenData.name,
        capacity: Number.parseInt(screenData.capacity),
        seatsLayout: {
          rows: Number.parseInt(screenData.rows),
          columns: Number.parseInt(screenData.columns),
        },
      }

      setFormData({
        ...formData,
        screens: [...formData.screens, newScreen],
      })

      // Reset screen form
      setScreenData({
        name: "",
        capacity: "",
        rows: "",
        columns: "",
      })
    }
  }

  const removeScreen = (index) => {
    const updatedScreens = [...formData.screens]
    updatedScreens.splice(index, 1)
    setFormData({
      ...formData,
      screens: updatedScreens,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      if (isEditMode) {
        await api.put(`/api/theaters/${id}`, formData)
      } else {
        await api.post("/api/theaters", formData)
      }

      navigate("/admin/theaters")
    } catch (err) {
      setError("Failed to save theater")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditMode) {
    return <div className="loading">Loading theater data...</div>
  }

  return (
    <div className="admin-theater-form">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{isEditMode ? "Edit Theater" : "Add New Theater"}</h2>
        </div>
        <div className="admin-card-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Theater Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-section">
              <h3>Facilities</h3>
              <div className="facility-input">
                <input
                  type="text"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="Add facility (e.g., Parking, Food Court)"
                  className="form-control"
                />
                <button type="button" onClick={addFacility} className="btn btn-secondary">
                  Add
                </button>
              </div>

              <div className="facilities-list">
                {formData.facilities.map((facility, index) => (
                  <div key={index} className="facility-item">
                    <span>{facility}</span>
                    <button type="button" onClick={() => removeFacility(index)} className="btn-icon delete">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                {formData.facilities.length === 0 && <p className="no-items">No facilities added yet</p>}
              </div>
            </div>

            <div className="form-section">
              <h3>Screens</h3>
              <div className="screen-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="screenName">Screen Name</label>
                    <input
                      type="text"
                      id="screenName"
                      name="name"
                      value={screenData.name}
                      onChange={handleScreenDataChange}
                      className="form-control"
                      placeholder="e.g., Screen 1, IMAX"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="capacity">Capacity</label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={screenData.capacity}
                      onChange={handleScreenDataChange}
                      className="form-control"
                      placeholder="Total seats"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="rows">Rows</label>
                    <input
                      type="number"
                      id="rows"
                      name="rows"
                      value={screenData.rows}
                      onChange={handleScreenDataChange}
                      className="form-control"
                      placeholder="Number of rows"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="columns">Columns</label>
                    <input
                      type="number"
                      id="columns"
                      name="columns"
                      value={screenData.columns}
                      onChange={handleScreenDataChange}
                      className="form-control"
                      placeholder="Seats per row"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addScreen}
                  className="btn btn-secondary"
                  disabled={!screenData.name || !screenData.capacity || !screenData.rows || !screenData.columns}
                >
                  Add Screen
                </button>
              </div>

              <div className="screens-list">
                {formData.screens.map((screen, index) => (
                  <div key={index} className="screen-item">
                    <div className="screen-details">
                      <h4>{screen.name}</h4>
                      <p>Capacity: {screen.capacity} seats</p>
                      <p>
                        Layout: {screen.seatsLayout.rows} rows × {screen.seatsLayout.columns} columns
                      </p>
                    </div>
                    <button type="button" onClick={() => removeScreen(index)} className="btn-icon delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
                {formData.screens.length === 0 && <p className="no-items">No screens added yet</p>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate("/admin/theaters")} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : isEditMode ? "Update Theater" : "Add Theater"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminTheaterForm