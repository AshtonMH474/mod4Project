    import { CiStar } from "react-icons/ci";
    import { useDispatch,useSelector } from "react-redux"
    import { NavLink } from "react-router-dom";
    import { useEffect} from "react"
    import './home.css'
    import { getAllSpots } from "../../store/spots";
    import Tooltip from "./Tooltip";
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
                    <div className="spotName">
                      <NavLink to={`/spots/${spot.id}`}>
                      <Tooltip spot={spot}/>
                      </NavLink>
                </div>



                  <div className="location">
                    <p>{spot.city}, {spot.state}</p>
                    {spot.avgRating > 0 && ( <p><CiStar className="star"/>{spot.avgRating}</p>)}
                    {spot.avgRating <= 0 && ( <p><CiStar className="star"/>New</p>)}

                  </div>
                  <div className="pricing">
                  <p className="price">
                    ${spot.price}
                    </p>
                    <p>night</p>
                    </div>
                </>
              )}
            </div>
          ))}
        </div>
      </>
    )
}

export default Home
