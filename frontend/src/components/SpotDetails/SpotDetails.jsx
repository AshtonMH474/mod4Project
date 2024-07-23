import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { CiStar } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { detailsOfSpot } from "../../store/spots";
import './SpotDetails.css'

 function SpotDetails (){
    const {spotId} = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots);
    console.log(spot);

    // const spotsArray = Object.values(spots);

    // let spot = spotsArray.find((curr) => curr.id == spotId);




      useEffect(() => {
         dispatch(detailsOfSpot(spotId));
      }, [dispatch,spotId]);


    //   const spot = useSelector((state) => state.spots);
    //   const preview = spot.SpotImages.find((image) => image.preview == true )

    if(!spot.SpotImages) return <div>Loading...</div>;

    let preview = spot.SpotImages.find((image) => image.preview == true);
    let imageArray = spot.SpotImages.filter((image) => image.preview == false);

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
        {imageArray.map((image) => (
        <div  key={image.id} className="spotImage">
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
            {spot.avgStarRating <= 0 && ( <div className="avg"><CiStar className="star"/>New</div>)}

             <div className="spotReview">
                {spot.numReviews} reviews
            </div>

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
    </>
)
}

export default SpotDetails
