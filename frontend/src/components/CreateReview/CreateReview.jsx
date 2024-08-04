import './CreateReview.css'
import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { useModal } from '../../Context/Modal';

import { addReview, updateReview } from '../../store/reviews';
import { useDispatch, useSelector } from 'react-redux';
import { detailsOfSpot } from '../../store/spots';

function CreateReview({spotId,refresh,currReview}){
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots);
    const [review, setReview] = useState('')
    const [rating, setRating] = useState(0);
    const [disabled,setDisable] = useState(true)
    const [errors,setErrors] = useState({})
    const {closeModal} = useModal();

    const handleRatingChange = (newRating) => {
      setRating(newRating);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const payload = { review, stars: rating };

        try {
            if(currReview){
                await dispatch(updateReview(currReview,payload));
            }
            if(!currReview){
                await dispatch(addReview(spotId, payload));
            }

          closeModal();
          refresh();
        } catch (res) {
            if(res){
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        }
        }
      };

    useEffect(() => {
       if(review.length < 10 || rating < 1) setDisable(true)
        if(review.length >= 10 && rating > 0 ) setDisable(false)
      if(spotId)dispatch(detailsOfSpot(spotId));

    },[dispatch,spotId,setDisable,rating,review])
    return (
          <>
      <div className='createReviewContainer'>
      {!currReview && (<h1 className='stay'>How was your stay?</h1>)}
      {currReview && spot && (<h1 className='stay'>How was your stay at {spot.name}?</h1>)}

      {errors.review && (
          <div className='reviewError'>{errors.review}</div>
        )}

        {errors.stars && (
          <div className='reviewError'>{errors.stars}</div>
        )}
      <form className='createReviewForm' onSubmit={handleSubmit}>

            <textarea type='review' value={review} placeholder='Leave your review here...'
            onChange={(e) => setReview(e.target.value)}/>


    <div className='starReview'>
    <StarRating rating={rating} onRatingChange={handleRatingChange}/>
    </div>
    {disabled == true &&  !currReview &&  (<button style={{backgroundColor:'#484848',cursor:'default'}} disabled={disabled} className='reviewSubmit'  type="submit">Submit Your Review</button>)}
    {disabled == false && !currReview && (<button style={{}} disabled={disabled} className='reviewSubmit'  type="submit">Submit Your Review</button>)}

    {disabled == true && currReview &&  (<button style={{backgroundColor:'#484848',cursor:'default'}} disabled={disabled} className='reviewSubmit'  type="submit">Update Your Review</button>)}
    {disabled == false && currReview &&  (<button style={{}} disabled={disabled} className='reviewSubmit'  type="submit">Update Your Review</button>)}

      </form>
      </div>
    </>
    )
}

export default CreateReview;
