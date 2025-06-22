import "./ReviewList.css"

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list">
        <h3>Reviews</h3>
        <div className="no-reviews">No reviews yet. Be the first to review!</div>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="review-list">
      <h3>Reviews ({reviews.length})</h3>

      {reviews.map((review) => (
        <div key={review._id} className="review-item">
          <div className="review-header">
            <div className="reviewer-info">
              <div className="reviewer-avatar">
                {review.userId.profilePic ? (
                  <img src={review.userId.profilePic || "/placeholder.svg"} alt={review.userId.name} />
                ) : (
                  <div className="avatar-placeholder">{review.userId.name.charAt(0)}</div>
                )}
              </div>
              <div className="reviewer-details">
                <h4>{review.userId.name}</h4>
                <span className="review-date">{formatDate(review.createdAt)}</span>
              </div>
            </div>
            <div className="review-rating">
              <span className="rating-value">{review.rating}</span>
              <i className="fas fa-star"></i>
            </div>
          </div>

          <div className="review-content">
            <p>{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
