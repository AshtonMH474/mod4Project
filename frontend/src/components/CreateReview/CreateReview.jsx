import './CreateReview.css'
import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { useModal } from '../../Context/Modal';

import { addReview } from '../../store/reviews';
import { useDispatch } from 'react-redux';

function CreateReview({spotId,refresh}){
    const dispatch = useDispatch();
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
          await dispatch(addReview(spotId, payload));
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


    },[setDisable,rating,review])
    return (
          <>
      <div className='createReviewContainer'>
      <h1 className='stay'>How was your stay?</h1>
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
    {disabled == true &&  (<button style={{backgroundColor:'#484848',cursor:'default'}} disabled={disabled} className='reviewSubmit'  type="submit">Submit Your Review</button>)}
    {disabled == false && (<button style={{}} disabled={disabled} className='reviewSubmit'  type="submit">Submit Your Review</button>)}


      </form>
      </div>
    </>
    )
}

export default CreateReview;
