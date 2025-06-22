"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import api from "../../utils/api"
import "./ReviewForm.css"

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.comment.trim()) {
      setError("Please enter a comment")
      return
    }

    try {
      setLoading(true)
      setError("")

      await api.post("/api/reviews", {
        movieId,
        rating: formData.rating,
        comment: formData.comment,
      })

      setSuccess(true)
      setFormData({ rating: 5, comment: "" })

      // Notify parent component to refresh reviews
      if (onReviewAdded) {
        onReviewAdded()
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="review-form-container">
        <div className="login-prompt">
          Please <a href="/login">login</a> to write a review
        </div>
      </div>
    )
  }

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>

      {success && <div className="alert alert-success">Your review has been submitted successfully!</div>}

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="rating-selector">
          <label>Your Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star}>
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={formData.rating === star}
                  onChange={handleChange}
                />
                <i className={`fas fa-star ${formData.rating >= star ? "active" : ""}`}></i>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            name="comment"
            rows="4"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Write your review here..."
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
