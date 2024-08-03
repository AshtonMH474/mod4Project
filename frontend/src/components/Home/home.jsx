    import { CiStar } from "react-icons/ci";
    import { useDispatch,useSelector } from "react-redux"
    import { NavLink } from "react-router-dom";
    import { useEffect} from "react"
    import './home.css'
    import { getAllSpots } from "../../store/spots";
    import Tooltip from "./Tooltip";
    import './homeMedia.css'
    // import Tooltip from "./Tooltip";




function Home() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots);

    const spotsArray = Object.values(spots);

      useEffect(() => {
        dispatch(getAllSpots());

      }, [dispatch]);

      return (
        <>
          <div className="row">
            {spotsArray.map((spot) => (
              <div key={spot.id} className="column">
                {spot.previewImage && (
                  <>
                  <NavLink className='linksToSpots' to={`/spots/${spot.id}`}>
                    <div className="spotName">

                      <Tooltip spot={spot}/>

                </div>



                  <div className="location">
                    <p>{spot.city}, {spot.state}</p>
                    {spot.avgRating > 0 && ( <p><CiStar className="star"/>{spot.avgRating.toFixed(1)}</p>)}
                    {spot.avgRating <= 0 && ( <p><CiStar className="star"/>New</p>)}

                  </div>
                  <div className="pricing">
                  <p className="price">
                    ${spot.price}
                    </p>
                    <p>night</p>

                    </div>
                    </NavLink>
                </>
              )}
            </div>
          ))}
        </div>
      </>
    )
}

export default Home
