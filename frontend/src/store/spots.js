const CURRENT_SPOTS = 'spots/CURRENT_SPOTS'
const CURRENT_SPOTDETAILS = 'spots/CURRENT_SPOTDETAILS'

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

export const getAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');

        if(res.ok){
        const data = await res.json();
        // console.log(data.Spots)
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

const spotReducer = (state = {} , action) => {
    switch(action.type){
    case CURRENT_SPOTS:{
        const newState = {};
        action.spots.forEach((spot) => {
            newState[spot.id] = spot;
        })
        return newState;

    }

    case CURRENT_SPOTDETAILS:{
        const newState = {...action.spot};
        return newState
    }
    default:return state

    }
}


export default spotReducer
