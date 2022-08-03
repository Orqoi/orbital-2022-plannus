import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/PlannerApp.css';
import { useState } from "react";
import ModuleTile from './ModuleTile';
import SearchOverlay from './SearchOverlay';
import { useDispatch } from 'react-redux';
import { shiftModule, checkGraduation, deleteSemester, saveSemester, reset } from "../../features/modules/moduleSlice";
import { updateUserPlanner, reset as resetUser } from '../../features/auth/authSlice';
import { useDrop } from 'react-dnd';

function SemesterTile({semesterId, title, darkMode, modules}) {

  

  const [{isOver}, drop] = useDrop({
    accept: "module",
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
    drop: (item) => onDrop(item), 
  })

  const onDrop = (item) => {
    
    if (semesterId !== item.semesterId) {
      const shiftModuleData = {
        module: item.module,
        previousSemesterId: item.semesterId,
        currentSemesterId: semesterId
      }

      dispatch(shiftModule(shiftModuleData))
      .then(() => dispatch(updateUserPlanner()))
      .then(() => dispatch(checkGraduation()))
      .then(() => dispatch(topLevelAction))
    }
    
  }

  const dispatch = useDispatch()

  const topLevelAction = () => dispatch => {
    return Promise.all([dispatch(reset()), dispatch(resetUser())])
  }

  const deleteSemesterOnClick = () => {
    dispatch(deleteSemester(semesterId)).then(() => dispatch(updateUserPlanner())).then(() => dispatch(checkGraduation())).then(()=> dispatch(topLevelAction()))
  }

  const saveSemesters = (e) => {
    if (e.target.innerText !== title) {
      const saveData = {
        semesterId: semesterId,
        content: e.target.innerText
      }
      
      dispatch(saveSemester(saveData)).then(()=> dispatch(updateUserPlanner())).then(() => dispatch(checkGraduation())).then(()=> dispatch(topLevelAction()))
    }
    
  }


  const [searching, setSearching] = useState(false);

  return (
    <div className="SemesterTile">
      {searching ? <SearchOverlay semesterId={semesterId}
      semesterTitle={title} searching={searching} setSearching={setSearching} /> : <></>}
      <div className='SemesterTileHeader'>
        <h4 onBlur={saveSemesters} contentEditable={true} suppressContentEditableWarning={true}>{title}</h4>
        <h5>{modules.reduce((prev, curr) => prev + curr.moduleCredit, 0)} MC</h5>
        <div className='delete-container' onClick={deleteSemesterOnClick}>
          <h5>Delete Semester</h5>
        </div>
        
      </div>
      <div className='SemesterTileBody' ref={drop} style={{backgroundColor: isOver ? "darkgrey" : "initial"}}>
         
        {modules.map((module, idx) => <ModuleTile idx={idx} darkMode={darkMode} key={module.moduleCode} semesterId={semesterId} module={module}/>)}

        
        
      </div>
      
      <div className='SemesterTileFooter' onClick={() => setSearching(!searching)}>
        <FontAwesomeIcon icon={faCirclePlus} />
      </div>
      
    </div>
    
  );
}

export default SemesterTile;