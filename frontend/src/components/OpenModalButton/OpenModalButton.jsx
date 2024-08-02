import { useModal } from "../../Context/Modal";

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };
  if(buttonText == 'Update') return <button className="deleteModal" onClick={onClick}>{buttonText}</button>
  if(buttonText == 'Delete')return <button   className="deleteModal" onClick={onClick}>{buttonText}</button>;
  if(buttonText == 'Create your Review')return <button   className="CreateReview" onClick={onClick}>{buttonText}</button>;
  return <button   className="buttonProfile" onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
