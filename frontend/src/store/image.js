const ADD_IMAGE = 'images/ADD_IMAGE'


const addOneImage = (image) => {
    return{
        type:ADD_IMAGE,
        image
    }
}


export const createImageSpot = (payload) => async(dispatch) => {
    const res = await fetch(`/api/spots/${payload.imageableId}/images`, {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(payload)
    })
    if(res.ok){
        const image = await res.json();
        dispatch(addOneImage(image));
        return image;
    }
}

const imageReducer = (state = {}, action) => {
    switch(action.type){
        case ADD_IMAGE:{
            const newState = {...state};
            newState[action.image.id] = action.image;
            return newState
        }
        default:return state
    }
}


export default imageReducer
