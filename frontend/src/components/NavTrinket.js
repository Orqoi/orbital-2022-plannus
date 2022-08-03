import { useSelector, useDispatch} from 'react-redux';
import '../assets/App.css';
import { Link } from 'react-router-dom';
import {logout} from "../features/auth/authSlice"

function NavTrinket({setActive, active}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logoutFunc = () => { 
    setActive(!active)
    dispatch(logout(user))
  };
    return (
      <div className="NavTrinket" id='NavTrinket'>
        <h3>{user ? user.name  : 'Not Logged In'}</h3>
        <img className='TrinketIcon' src={user && user.profileImage ? user.profileImage : 'https://res.cloudinary.com/dqreeripf/image/upload/v1656242180/xdqcnyg5zu0y9iijznvf.jpg'} alt='user profile' />
        <Link to='/' onClick={() => setActive(!active)}>Home</Link>
        
        {
          !user 
          ? <>
              <Link to='/login' onClick={() => setActive(!active)}>Login</Link>
              <Link to='/register' onClick={() => setActive(!active)}>Register</Link>
            </>
          : <>
              <Link to='/settings' onClick={() => setActive(!active)}>Account</Link>
              <Link to='/' onClick= {logoutFunc}>Logout</Link>
            </>
        }
      </div>
    );
  }
  
  export default NavTrinket;