import { useState } from 'react';
import { CiStar } from 'react-icons/ci';
import './StarRating.css';

const StarRating = ({ rating = 0, onRatingChange }) => {
  const [hover, setHover] = useState(null);

  const handleClick = (newRating) => {
    onRatingChange(newRating);
  };

  const handleMouseEnter = (newRating) => {
    setHover(newRating);
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <CiStar
          key={star}
          className={`star2 ${star <= (hover || rating) ? 'filled' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};
export default StarRating
