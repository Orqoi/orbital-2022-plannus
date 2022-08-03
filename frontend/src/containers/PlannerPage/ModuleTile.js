import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/PlannerApp.css';
import { checkGraduation, deleteModule, reset} from '../../features/modules/moduleSlice';
import { updateUserPlanner, reset as resetUser } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import { useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';

function ModuleTile({module, semesterId, idx, darkMode}) {
  
  const dispatch = useDispatch()
  const [{isDragging}, drag, preview] = useDrag(() => ({
    type: "module",
    item: {
      module: module,
      semesterId: semesterId,
      idx: idx,
      darkMode: darkMode,
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    })
  }))

  useEffect(() => {
    preview(getEmptyImage())
  })

  const topLevelAction = () => dispatch => {
    return Promise.all([dispatch(reset()), dispatch(resetUser())])
  }

  const deleteModuleOnClick = () => {
    const deleteModuleData = {
      module : module,
      semesterId : semesterId
    }
    dispatch(deleteModule(deleteModuleData)).then(()=> dispatch(updateUserPlanner())).then(() => dispatch(checkGraduation())).then(()=> dispatch(topLevelAction))
  }

  return (
    <div ref={drag} className="ModuleTile" style={{backgroundColor: module.color, display: isDragging ? 'none' : 'initial'}}>
       <div className='tile-close-container'>
           <FontAwesomeIcon icon={faXmark} className="tile-close-button" onClick={deleteModuleOnClick}  />
       </div>
       <h5>{module.moduleCode}</h5>
       <h5>{module.moduleCredit} MC</h5>
    </div>
  );
}

export default ModuleTile;