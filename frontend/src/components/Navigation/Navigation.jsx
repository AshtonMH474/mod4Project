import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div >
    <ul className='top'>
      <li >
        <NavLink to="/"><img className='logo' src='https://i.pinimg.com/736x/3c/bf/be/3cbfbe148597341fa56f2f87ade90956.jpg' alt='airbnb'/></NavLink>
      </li>
      {isLoaded && (
        <li className='profile' >
          <ProfileButton user={sessionUser}  />
        </li>
      )}
    </ul>

    </div>
  );
}

export default Navigation;
