"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import "./AdminPages.css"

const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [roleFilter, setRoleFilter] = useState("")
  const [showAddAdminForm, setShowAddAdminForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [formSuccess, setFormSuccess] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await api.get("/api/users")
        setUsers(res.data.users)
        setFilteredUsers(res.data.users)
      } catch (err) {
        setError("Failed to fetch users")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Handle search and filter
  useEffect(() => {
    let filtered = users

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.phone && user.phone.includes(searchQuery)),
      )
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchQuery, roleFilter, users])

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        const res = await api.post("/api/users/admin", formData)

        // Add new admin to the list
        setUsers([...users, res.data.user])
        setFilteredUsers([...filteredUsers, res.data.user])

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
        })

        setFormSuccess("Admin user created successfully")

        // Clear success message after 3 seconds
        setTimeout(() => {
          setFormSuccess("")
          setShowAddAdminForm(false)
        }, 3000)
      } catch (err) {
        setFormErrors({
          ...formErrors,
          general: err.response?.data?.message || "Failed to create admin user",
        })
      }
    }
  }

  // Handle user delete
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/users/${userId}`)

        // Update local state
        setUsers(users.filter((user) => user._id !== userId))
        setFilteredUsers(filteredUsers.filter((user) => user._id !== userId))
      } catch (err) {
        console.error("Failed to delete user:", err)
      }
    }
  }

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return <div className="admin-container loading">Loading users...</div>
  }

  if (error) {
    return <div className="admin-container error">{error}</div>
  }

  return (
    <div className="admin-users-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Manage Users</h1>
          <p>View and manage all users in the system</p>
        </div>

        <div className="admin-actions">
          <div className="admin-search">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => setShowAddAdminForm(!showAddAdminForm)}>
            <i className="fas fa-plus"></i> Add Admin User
          </button>
        </div>

        {showAddAdminForm && (
          <div className="admin-card mb-3">
            <div className="admin-card-header">
              <h2>Add New Admin User</h2>
            </div>
            <div className="admin-card-body">
              {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
              {formErrors.general && <div className="alert alert-error">{formErrors.general}</div>}

              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${formErrors.name ? "error" : ""}`}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {formErrors.name && <div className="form-error">{formErrors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-control ${formErrors.email ? "error" : ""}`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <div className="form-error">{formErrors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={`form-control ${formErrors.password ? "error" : ""}`}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {formErrors.password && <div className="form-error">{formErrors.password}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-control ${formErrors.phone ? "error" : ""}`}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddAdminForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Admin User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admin-filters">
          <div className="filter-group">
            <label>Role:</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="form-control">
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {roleFilter && (
            <button className="btn btn-outline" onClick={() => setRoleFilter("")}>
              Clear Filter
            </button>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            {currentUsers.length === 0 ? (
              <div className="no-data">No users found</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || "N/A"}</td>
                      <td>
                        <span className={`role-badge ${user.role === "admin" ? "admin" : "user"}`}>{user.role}</span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteUser(user._id)}
                            title="Delete User"
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

export default AdminUsersPage
