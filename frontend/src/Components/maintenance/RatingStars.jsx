// RatingStars component - displays star rating (1 to 5)
// Two modes:
//   1. Display mode (readOnly=true) - just shows filled/empty stars
//   2. Input mode (readOnly=false) - user can click to select rating
// Used in ticket detail view for students to rate resolved tickets

function RatingStars({ rating = 0, onRate, readOnly = false }) {
  // Create an array of 5 items to render 5 stars
  const stars = [1, 2, 3, 4, 5]

  // Handle star click - only works if not read-only
  function handleClick(starValue) {
    if (!readOnly && onRate) {
      onRate(starValue)
    }
  }

  return (
    <div className="rating-stars">
      {stars.map((starValue) => (
        <button
          key={starValue}
          type="button"
          className={`rating-star ${starValue <= rating ? 'star-filled' : 'star-empty'}`}
          onClick={() => handleClick(starValue)}
          disabled={readOnly}
          aria-label={`Rate ${starValue} out of 5`}
        >
          {/* Show filled star if rating is >= this star's value, empty star otherwise */}
          {starValue <= rating ? '\u2605' : '\u2606'}
        </button>
      ))}
      {/* Show the rating number next to stars */}
      {rating > 0 && <span className="rating-value">{rating}/5</span>}
    </div>
  )
}

export default RatingStars
