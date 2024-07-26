import { csrfFetch } from "./csrf"
const CURRENT_SPOTS = 'spots/CURRENT_SPOTS'
const CURRENT_SPOTDETAILS = 'spots/CURRENT_SPOTDETAILS'
const CREATE_SPOT = 'spots/CREATE_SPOT'

const loadSpotDetails = (spot) => {
    return {
        type:CURRENT_SPOTDETAILS,
        spot
    }
}



const loadSpots = (spots) => {
    return {
        type:CURRENT_SPOTS,
        spots
    }
}

const addOneSpot = (spot) => {
    return{
    type:CREATE_SPOT,
    spot
    }
}

export const getAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');

        if(res.ok){
        const data = await res.json();
        dispatch(loadSpots(data.Spots));

        return data.Spots;
        }

}


export const detailsOfSpot = (id) => async (dispatch) => {
    const res = await fetch(`/api/spots/${id}`);
    if(res.ok){
        const data = await res.json();
        console.log(data)
         dispatch(loadSpotDetails(data));
         return data
    }
}

export const createSpot = (images,payload) => async (dispatch) => {
    const res = await csrfFetch('/api/spots',{
        method:'POST',
        body:JSON.stringify(payload)
    });



    if(res.ok){
        const spot = await res.json();
        for(let i = 0; i < images.length; i++){
            let image = images[i];

            let res2 = await csrfFetch(`/api/spots/${spot.id}/images`,{
                method:'POST',
                body:JSON.stringify(image)
            })
            let createdImage = await res2.json();
            console.log(createdImage);

        }

        dispatch(addOneSpot(spot));
        return spot;
    }

}

const spotReducer = (state = {} , action) => {
    switch(action.type){
    case CURRENT_SPOTS:{
        const newState = {};
        action.spots.forEach((spot) => {
            newState[spot.id] = spot;
        })
        return newState;

    }
    case CREATE_SPOT:{
        const newState = {...state};
        newState[action.spot.id] = action.spot
        return newState
    }

    case CURRENT_SPOTDETAILS:{
        const newState = {...action.spot};
        return newState
    }
    default:return state

    }
}


export default spotReducer
