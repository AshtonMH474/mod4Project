import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { CiStar } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { detailsOfSpot } from "../../store/spots";
import './SpotDetails.css'
import { reviewsForSpot } from "../../store/reviews";

 function SpotDetails (){
    const {spotId} = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots);
    const reviews = useSelector((state) => state.reviews)
    // console.log(reviews)

      useEffect(() => {
       dispatch(detailsOfSpot(spotId));
       dispatch(reviewsForSpot(spotId))

      }, [dispatch,spotId]);


      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      };

    if(!spot.SpotImages) return <div>Loading...</div>;

    let preview = spot.SpotImages.find((image) => image.preview == true);
    let imageArray = spot.SpotImages.filter((image) => image.preview == false);
    let reviewsArray = Object.values(reviews);
    console.log(reviewsArray)

return (
    <>
    <div className="spotContainer">
        <div className="spotInfo">
    <h2 className="spotH2">{spot.name}</h2>
    <p className="spotLocation">{spot.city}, {spot.state}, {spot.country}</p>
        </div>
    <div className="images">
        <div className="spotPreview">
        <img className="previewDetails" src={preview.url} alt='preview'/>
        </div>

        {imageArray.map((image,i) => (
        <div  key={image.id} className={`spotImage${i}`}>
        <img className="currImage" key={image.id} src={image.url} alt='image' />
        </div>
        ))}

    </div>

        <div className="ownerD">
        <h2 className="spotName">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
        <p className="spotD">
        {spot.description}
        </p>
        </div>

        <div className="spotRating">

            <div id='avgReview'>

             {spot.avgStarRating > 0 && ( <div className="avg" ><CiStar className="star"/>{spot.avgStarRating}</div>)}
             {spot.avgStarRating <= 0 && ( <div className="avgNew"><CiStar className="starNew"/>New</div>)}

             {spot.numReviews > 0 && (<div className="spotReview">
                {spot.numReviews} reviews
            </div>)}

            </div>

            <div className="spotPricing">
            <div className='pricing'>
                <div id="spotPrice">${spot.price}</div>
                <div id='night'>night</div>
            </div>
            </div>


            <div className="buttonR">
            <button className="reserve">
                Reserve
            </button>
            </div>
        </div>

    </div>


    <div className="reviewsPerSpot">
        <div className="reviewTop">
        {spot.avgStarRating > 0 && ( <h2 id="starReview"> <CiStar className="starTop" />{spot.avgStarRating}</h2>)}
        {spot.avgStarRating <= 0 && ( <h2 id="starReview"><CiStar className="starTop"/>New</h2>)}

         {spot.numReviews > 0 && (<h2 id='reviewNum'>
                {spot.numReviews} reviews
            </h2>)}
        </div>

        <div className="allReviews">
            {reviewsArray.map((review) => (
                <div className="currReview" key={review.id}>
               <h3 className="nameReview">{review.User.firstName}</h3>
               <h3 className="dateReview">{formatDate(review.createdAt)}</h3>
               <p className="reviewContent">{review.review}</p>
               </div>
            ))}

        </div>
    </div>
    </>
)
}

export default SpotDetails
