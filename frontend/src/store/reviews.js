const SPOT_REVIEWS = 'reviews/SPOT_REVIEWS'

 const spotReviews = (reviews) => {
    return{
        type:SPOT_REVIEWS,
        reviews
    }
}

export const reviewsForSpot = (spotId) => async(dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);

    if(res.ok){
        const data = await res.json();
        // console.log(data.Reviews)
        dispatch(spotReviews(data.Reviews))
        return data.Reviews
    }
}


const reviewReducer = (state = {}, action) => {
    switch (action.type){
        case SPOT_REVIEWS:{
            const newState = {...action.reviews};

            return newState;
        }
        default:return state
    }
}


export default reviewReducer;
