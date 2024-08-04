import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import CreateReview from "../CreateReview";
import DeleteReview from "../DeleteReview";


function ManageReviews () {
    const dispatch = useDispatch();
    const [reviewList, setReviewList] = useState([]);
    const sessionUser = useSelector((state) => state.session.user)
    const userId = sessionUser.id


    const handleModalClose = async () => {
        const reviewsData = await dispatch(currReviews());
        setReviewList(Object.values(reviewsData));
        console.log(reviewList);

      };

      useEffect(() => {
        async function getData () {
        const reviewsData = await dispatch(currReviews());
        setReviewList(Object.values(reviewsData));

        }
        getData();
      },[reviewList.length,dispatch])

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      };

      return (

        <div className="allReviews">
        {reviewList.slice().reverse().map((review) => (
        <div className="currReview" key={review.id}>

         {review.User ? (
        <>
            <h3 className="nameReview">{review.User.firstName}</h3>
        <h3 className="dateReview">{formatDate(review.createdAt)}</h3>
        <p className="reviewContent">{review.review}</p>

            <div className="divider">
        {sessionUser && review.User.id == userId && (
            <OpenModalButton  className='deleteReview'
            buttonText="Update" modalComponent={<CreateReview spotId={review.spotId} refresh={handleModalClose} currReview={review}  />}
         /> )}
            {sessionUser && review.User.id == userId && (<OpenModalButton buttonText='Delete' className="deleteReview" modalComponent={<DeleteReview reviewId={review.id} refresh={handleModalClose} />}/>)}
            </div>
        </>
        ):(
            <p>Loading...</p>
        )}
        </div>
        ))}

        </div>

      )



}


export default ManageReviews;
