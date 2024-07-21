import { CgProfile } from "react-icons/cg";

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false)
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  if(showMenu == true){
  return (
    <>

      <button className="profile" onClick={toggleMenu}>
        <CgProfile className="profile-logo" />
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
          <div className="boxProfile">
            <div>{user.username}</div>
            <div>{user.firstName} {user.lastName}</div>
            <div>{user.email}</div>
            <div>
              <button onClick={logout}>Log Out</button>
            </div>
            </div>
          </>
        ) : (
          <>
            <div className="boxProfile">
            <div >
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </div>
            <div>
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
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

         <button className="profile" onClick={toggleMenu}>
             <CgProfile className="profile-logo" />
        </button>
        </>
    )
}
}

export default ProfileButton;
