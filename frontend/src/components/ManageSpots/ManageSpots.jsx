import { useDispatch,useSelector } from "react-redux";
import { CiStar } from "react-icons/ci";
import { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import './ManageSpots.css';

function ManageSpots() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots);
    const spotsArray = Object.values(spots);
    const sessionUser = useSelector(state => state.session.user);




    useEffect(() => {
        dispatch(getAllSpots());

      }, [dispatch]);

      if(!spotsArray.length) return <h1>Loading...</h1>

    let newArr = spotsArray.filter((spot) => spot.ownerId == sessionUser.id);
    console.log(newArr)
    return(
        <>
        <div className="manageSpotContainer">
            <h1>Manage your Spots</h1>
            <button onClick={() => navigate(`/spots/new`)} className="ManageCreate">Create a New Spot</button>

            <div className="mySpots">
            {newArr.map((spot) => (
            <>
            <div id="currSpot">
                    <img  className="preview" src={spot.previewImage} alt={spot.id}/>
                    <div className="locationMySpots">
                        <div>{spot.city}, {spot.state}</div>
                        <div><CiStar className="starMySpot"/>{spot.avgRating}</div>
                        </div>
                <div className="pricesForMySpots">
                    <div id='priceMySpots'>${spot.price}</div>
                    <div className="night">night</div>
                </div>
                <div className="buttonsMySpots">
                    <div><button onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button></div>
                    <div><button>Delete</button></div>
                </div>
             </div>

            </>
          ))}
            </div>
        </div>
        </>
    );
}

export default ManageSpots;
