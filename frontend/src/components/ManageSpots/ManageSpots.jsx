import { useDispatch,useSelector } from "react-redux";
import { CiStar } from "react-icons/ci";
import { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import { NavLink, useNavigate } from "react-router-dom";
import './ManageSpots.css';
import './ManageQueries.css'
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "../DeleteSpot";

function ManageSpots() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots);
    const spotsArray = Object.values(spots);
    const sessionUser = useSelector(state => state.session.user);




    useEffect(() => {
        dispatch(getAllSpots());

      }, [dispatch,spotsArray.length]);

      if(!spotsArray.length) return <h1>Loading...</h1>

    let newArr = spotsArray.filter((spot) => spot.ownerId == sessionUser.id);
    console.log(newArr)
    return(
        <>
        <div className="manageSpotContainer">
            <h1>Manage your Spots</h1>
            {!newArr.length && (<button onClick={() => navigate(`/spots/new`)} className="ManageCreate">Create a New Spot</button>)}

            <div className="mySpots">
            {newArr.map((spot) => (
            <>

            <div id="currSpot" key={spot.id}>
            <NavLink className='linksToSpots' to={`/spots/${spot.id}`}>
                    <img  className="preview" src={spot.previewImage} alt={spot.id}/>

                    <div className="locationMySpots">
                        <div>{spot.city}, {spot.state}</div>
                       {spot.avgRating > 0 && (<div><CiStar className="starMySpot"/>{spot.avgRating.toFixed(1)}</div>)}
                       {spot.avgRating <= 0 && (<div><CiStar className="starMySpot"/>New</div>)}
                        </div>
                <div className="pricesForMySpots">
                    <div id='priceMySpots'>${spot.price}</div>
                    <div className="night">night</div>
                </div>
                </NavLink>
                <div className="buttonsMySpots">
                    <div><button onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button></div>
                    <div>   <OpenModalButton  className='deleteModal'
                    buttonText="Delete"
                    modalComponent={<DeleteSpot spot={spot}/>}/></div>
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
