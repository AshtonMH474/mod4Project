
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useNavigate } from "react-router-dom";

function ProfileButton({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };


  const closeMenu = (e) => {
    if (!ulRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (!showMenu) return;



    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false)
    navigate('/')

  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  if(showMenu == true){
  return (
    <>


       <div className="profile"  onClick={toggleMenu}>
             <FontAwesomeIcon  className="profile-logo" icon={faAddressCard} />
             </div>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
          <div className="boxProfile">
            <div>Hello, {user.firstName}</div>
            <div>{user.email}</div>
            <div>
                <button className="buttonProfile" onClick={() => navigate('spots/current')}>Manage Spots</button>
            </div>
            <div>
                <button className="buttonProfile" onClick={() => navigate('reviews/current')}>Manage Reviews</button>
            </div>
            <div>
              <button className="buttonProfile" onClick={logout}>Log Out</button>
            </div>
            </div>
          </>
        ) : (
          <>
            <div className="boxProfile">
            <div >
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal setShowMenu={setShowMenu} />}
              />
            </div>
            <div>
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal setShowMenu={setShowMenu}  />}
              />
            </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}else{
    return (
        <>



             <div className="profile" onClick={toggleMenu}>
             <FontAwesomeIcon className="profile-logo" icon={faAddressCard} />
             </div>

        </>
    )
}
}

export default ProfileButton;
