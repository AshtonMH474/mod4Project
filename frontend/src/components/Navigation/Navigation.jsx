import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAirbnb } from '@fortawesome/free-brands-svg-icons';
import { getAllSpots } from '../../store/spots';
import { useDispatch } from 'react-redux';

function Navigation({ isLoaded }) {
    const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const refresh = async () => {
    // Refresh the reviews and spot details
    await dispatch(getAllSpots());

  };

  return (
    <div >
    <ul className='top'>
      <li >

        <div>
        <NavLink to="/"><FontAwesomeIcon className='logo' icon={faAirbnb}  /></NavLink>
        <NavLink className='logoName' to="/">airbnb</NavLink>
        </div>

      </li>

      <li>

      </li>
      {isLoaded && (

        <li className={sessionUser ? 'relativePosition' : 'groupLinks'}>
            <div className='newSpot'>
            {sessionUser && (<NavLink onClick={refresh} className='newSpotLink' to='/spots/new'>Create a New Spot</NavLink>)}
            </div>
            <div>
          <ProfileButton user={sessionUser}  />
          </div>
        </li>
      )}
    </ul>

    </div>
  );
}

export default Navigation;
