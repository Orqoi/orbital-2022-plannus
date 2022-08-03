import '../assets/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';


function SideBarItem({iconName, content, link}) {
    return (
      link === '/nusmods'
      ? <a href='https://nusmods.com' rel="noreferrer" target="_blank" className='SideBarItem'>
          <FontAwesomeIcon className="SideBarIcon" icon={iconName} />
          <p className='SideBarText'>{content}</p>
        </a>
        
      : <NavLink to={link} className="SideBarItem">
          <FontAwesomeIcon className="SideBarIcon" icon={iconName} />
          <p className='SideBarText'>{content}</p>
        </NavLink>
    );
  }
  
  export default SideBarItem;