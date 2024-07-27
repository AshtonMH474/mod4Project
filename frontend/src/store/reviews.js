import { csrfFetch } from "./csrf";

const SPOT_REVIEWS = 'reviews/SPOT_REVIEWS'
const ADD_ONE = 'reviews/ADD_ONE'

 const spotReviews = (reviews) => {
    return{
        type:SPOT_REVIEWS,
        reviews
    }
}

const  newReview = (review) => {
    return {
        type:ADD_ONE,
        review
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

export const addReview = (spotId,payload) => async(dispatch) => {

    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method:'POST',
        body: JSON.stringify(payload)
    });

    if(res.ok){
        const data = await res.json();
        dispatch(newReview(data));
        return data;
    }
}


const reviewReducer = (state = {}, action) => {
    switch (action.type){
        case SPOT_REVIEWS:{
            const newState = {...action.reviews};

            return newState;
        }

        case ADD_ONE:{
            const newState = {...state};
            newState[action.review.id] = action.review;
            return newState;
        }
        default:return state
    }
}


export default reviewReducer;
