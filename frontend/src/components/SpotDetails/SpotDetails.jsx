import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { CiStar } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { detailsOfSpot } from "../../store/spots";

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
    <h1>{spot.name}</h1>
    <p>{spot.city}, {spot.state}, {spot.country}</p>

    <div>
    <img src={preview.url} alt='preview'/>
    {imageArray.map((image) => (
    <img key={image.id} src={image.url} alt='image' />
    ))}
    </div>

    <div>
        <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
        <p>
        {spot.description}
        </p>
        <div>
        {spot.avgStarRating > 0 && ( <div><CiStar className="star"/>{spot.avgStarRating}</div>)}
        {spot.avgStarRating <= 0 && ( <div><CiStar className="star"/>New</div>)}
            <div>
                ${spot.price} night
            </div>
             <div>
                {spot.numReviews} reviews
            </div>
            <button>
                Reserve
            </button>
        </div>
    </div>
    </>
)
}

export default SpotDetails
