import { csrfFetch } from "./csrf"
const CURRENT_SPOTS = 'spots/CURRENT_SPOTS'
const CURRENT_SPOTDETAILS = 'spots/CURRENT_SPOTDETAILS'
const CREATE_SPOT = 'spots/CREATE_SPOT'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'

const loadSpotDetails = (spot) => {
    return {
        type:CURRENT_SPOTDETAILS,
        spot
    }
}

const updatingSpot = (spot) => {
    return{
        type:UPDATE_SPOT,
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

const deleteOneSpot = (spot) => {
    return{
        type:DELETE_SPOT,
        spot
    }
}

export const deleteSpot = (spot) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`,{
        method:'DELETE'
    })

    if(res.ok){
        const data = await res.json();
        dispatch(deleteOneSpot(spot))
        return data;
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

// export const userSpots = () => async (dispatch) => {
//     const res = await fetch
// }

export const detailsOfSpot = (id) => async (dispatch) => {
    const res = await fetch(`/api/spots/${id}`);
    if(res.ok){
        const data = await res.json();
        console.log(data)
         dispatch(loadSpotDetails(data));
         return data
    }
}

export const updateSpot = (payload,id) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}`,{
        method:"PUT",
        body:JSON.stringify(payload)
    })

    if(res.ok){
        const spot = res.json();


        dispatch(updatingSpot(spot));
        return spot;
    }
}

export const createSpot = (images,payload) => async (dispatch) => {




    const res = await csrfFetch('/api/spots',{
        method:'POST',
        body:JSON.stringify(payload)
    });


    // console.log(await res.json())
    if(res.ok){
        const spot = await res.json();

        for(let i = 0; i < images.length; i++){
            let imageFile = images[i];
            const formData = new FormData();


            formData.append('file', imageFile);
            if(i == 0) formData.append('preview','true');

            try{
           await csrfFetch(`/api/spots/${spot.id}/images`,{
                method:'POST',
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                body:formData
            })
        }catch(e){
            await csrfFetch(`/api/spots/${spot.id}`,{
                method:'DELETE'
            })
            let error = new Error("Image URL's must end in .png, .jpg, or .jpeg");
            return error;


        }

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
    case UPDATE_SPOT:{
        const newState = {...state};
         newState[action.spot.id] = action.spot
         return newState;
    }
    case DELETE_SPOT:{
        const newState = {...state};
        delete newState[action.spot.id];
        return newState;
    }
    default:return state

    }
}


export default spotReducer
