import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";
import { deleteReview } from "../../store/reviews";

function DeleteReview ({reviewId,refresh}){
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const handleSubmit = async(e) => {
        e.preventDefault();
       await dispatch(deleteReview(reviewId));
        refresh();
        closeModal();
    }
    return (
        <>
        <h1 className='deleteH1'>Confirm Delete</h1>
        <div className='deleteModalContainer'>

            <h2>Are you sure you want to delete this review?</h2>

            <div className='buttonsDelete'>
               <div><button  onClick={handleSubmit} className='deleteSpot'>Yes(Delete Review)</button></div>
                <div><button onClick={closeModal} className='keepSpot'>No(Keep Review)</button></div>
            </div>
        </div>
        </>

    )
}


export default DeleteReview;
