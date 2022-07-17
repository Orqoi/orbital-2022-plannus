import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/PlannerApp.css';
import { checkGraduation, deleteModule, reset} from '../../features/modules/moduleSlice';
import { updateUserPlanner, reset as resetUser } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import * as tinycolor from 'tinycolor2';


function ModuleTile(props) {

  const dispatch = useDispatch()
  const [{isDragging}, drag] = useDrag(() => ({
    type: "module",
    item: {
      module: props.module,
      semesterId: props.semesterId,
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    })
  }))

  const topLevelAction = () => dispatch => {
    return Promise.all([dispatch(reset()), dispatch(resetUser())])
  }

  const deleteModuleOnClick = () => {
    const deleteModuleData = {
      module : props.module,
      semesterId : props.semesterId
    }
    dispatch(deleteModule(deleteModuleData)).then(()=> dispatch(updateUserPlanner())).then(() => dispatch(checkGraduation())).then(()=> dispatch(topLevelAction))
  }

  return (
    <div ref={drag} className="ModuleTile" style={{backgroundColor: props.darkMode ? tinycolor(props.module.color).darken(30) : props.module.color, display: isDragging ? 'none' : 'initial'}}>
       <div className='tile-close-container'>
           <FontAwesomeIcon icon={faXmark} className="tile-close-button" onClick={deleteModuleOnClick}  />
       </div>
       <h5>{props.module.moduleCode}</h5>
       <h5>{props.module.moduleCredit} MC</h5>
    </div>
  );
}

export default ModuleTile;