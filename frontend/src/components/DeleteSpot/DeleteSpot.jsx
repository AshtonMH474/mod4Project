import { useDispatch } from 'react-redux';
import { useModal } from '../../Context/Modal'
import './DeleteSpot.css'
import { deleteSpot, getAllSpots } from '../../store/spots';



function DeleteSpot({spot}){
    const dispatch = useDispatch();
    const {closeModal} = useModal();


    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(deleteSpot(spot));
        await dispatch(getAllSpots());
        closeModal();

    }

    return (
        <>
        <h1 className='deleteH1'>Confirm Delete</h1>
        <div className='deleteModalContainer'>

            <h2>Are you sure you want to remove this spot
            from the listings?</h2>

            <div className='buttonsDelete'>
               <div><button onClick={handleSubmit} className='deleteSpot'>Yes(Delete Spot)</button></div>
                <div><button onClick={closeModal} className='keepSpot'>No(Keep Spot)</button></div>
            </div>
        </div>
        </>

    )
}

export default DeleteSpot
