    import { CiStar } from "react-icons/ci";
    import { useDispatch,useSelector } from "react-redux"
    import { useEffect } from "react"
    import './home.css'
    import { getAllSpots } from "../../store/spots";

function Home() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots);
    const spotsArray = Object.values(spots);


    useEffect(() => {
        dispatch(getAllSpots());

    },[dispatch])

    console.log(spotsArray)
    return (
        <>
        <div className="row">
          {spotsArray.map((spot) => (
            <div key={spot.id} className="column">
              {spot.previewImage && (
                <>
                  <img className="preview" src={spot.previewImage} alt={spot.id} />
                  <div className="location">
                    <p>{spot.city}, {spot.state}</p>

                    <p><CiStar className="star"/>{spot.avgRating}</p>
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
