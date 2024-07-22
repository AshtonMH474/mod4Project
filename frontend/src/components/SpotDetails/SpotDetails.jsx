import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import { useParams } from "react-router-dom";

function SpotDetails(){
    const {spotId} = useParams();
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots);
    const spotsArray = Object.values(spots);

    let spot = spotsArray.find((curr) => curr.id == spotId);


      useEffect(() => {
        dispatch(getAllSpots());
      }, [dispatch]);
return (
    <>
    <h1>{spot.name}</h1>
    <p>{spot.city}, {spot.state}, {spot.country}</p>
    </>
)
}

export default SpotDetails
