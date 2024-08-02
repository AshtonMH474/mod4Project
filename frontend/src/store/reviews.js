import { csrfFetch } from "./csrf";
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'
const SPOT_REVIEWS = 'reviews/SPOT_REVIEWS'
const ADD_ONE = 'reviews/ADD_ONE'
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW'

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

const removedReview = (reviewId) => {
    return{
        type:DELETE_REVIEW,
        reviewId
    }
}

const updatedReview = (review) => {
    return{
        type:UPDATE_REVIEW,
        review
    }
}

export const updateReview = (review,payload) => async(dispatch) => {
    const res = await csrfFetch(`/api/reviews/${review.id}`, {
        method:'PUT',
        body: JSON.stringify(payload)
    });
    if(res.ok){
        const data = await res.json();
        dispatch(updatedReview(data));
        return data;
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

export const deleteReview = (reviewId) => async(dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method:'DELETE'
    });

    const data = res.json();
        console.log(data);
    if(res.ok){

        dispatch(removedReview(reviewId));
        return data
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
        case DELETE_REVIEW: {
            const newState = {...state};
            delete newState[action.reviewId];
            return newState;
        }
        case UPDATE_REVIEW:{
            const newState = {...state};
            newState[action.review.id] = action.review;
            return newState;
        }
        default:return state
    }
}


export default reviewReducer;
