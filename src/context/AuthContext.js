"use client"

import { createContext, useState, useContext, useEffect } from "react"
import api from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setLoading(false)
          return
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`

        const res = await api.get("/api/auth/me")

        setUser(res.data.user)
        setIsAuthenticated(true)
      } catch (err) {
        localStorage.removeItem("token")
        api.defaults.headers.common["Authorization"] = null
        setError(err.response?.data?.message || "Authentication failed")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/register", userData)

      localStorage.setItem("token", res.data.token)
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

      setUser(res.data.user)
      setIsAuthenticated(true)
      setError(null)

      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/login", userData)

      localStorage.setItem("token", res.data.token)
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

      setUser(res.data.user)
      setIsAuthenticated(true)
      setError(null)

      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    api.defaults.headers.common["Authorization"] = null
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      const res = await api.put("/api/users/profile", userData)

      setUser(res.data.user)
      setError(null)

      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/change-password", passwordData)
      setError(null)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/forgot-password", { email })
      setError(null)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Forgot password request failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (resetData) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/reset-password", resetData)
      setError(null)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
