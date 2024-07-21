const CURRENT_SPOTS = 'spots/CURRENT_SPOTS'

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

const spotReducer = (state = {} , action) => {
    switch(action.type){
    case CURRENT_SPOTS:{
        const newState = {};
        action.spots.forEach((spot) => {
            newState[spot.id] = spot;
        })
        return newState;

    }
    default:return state

    }
}


export default spotReducer
