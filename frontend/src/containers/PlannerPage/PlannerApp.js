import '../../assets/PlannerApp.css';
import SemesterTile from './SemesterTile';
import { useSelector, useDispatch } from 'react-redux';
import { addSemester, checkGraduation, clearSemesters, reset} from "../../features/modules/moduleSlice"
import { updateUserPlanner, reset as resetUser } from '../../features/auth/authSlice';
import { useRef } from 'react';
import exportAsImage from '../../app/exportAsImage';
import { CustomDragLayer } from '../../components/CustomDragLayer';
import CourseDropdown from './CourseDropdown';

function PlannerApp({userPlanner, darkMode, setRequirementsActive, requirementsActive}) {
    const {canGraduate} = useSelector(state => state.modules)
    const dispatch = useDispatch();
    const exportRef = useRef();

    const topLevelAction = () => dispatch => {
        return Promise.all([dispatch(reset()), dispatch(resetUser())])
    }

    const onCapture = (e) => {
        e.preventDefault();
        exportAsImage(exportRef.current, "academic_plan")
    }

    const addSemestersOnClick = (e) => {
        e.preventDefault();
        const newSemester = {
            title: 'Year ' + ((userPlanner.length + 1) % 2 === 0 ? Math.floor((userPlanner.length + 1) / 2) : Math.floor((userPlanner.length + 1) / 2) + 1)
            + ' Semester ' + (userPlanner.length % 2 + 1),
            modules: []
        }
        dispatch(addSemester(newSemester)).then(()=> dispatch(updateUserPlanner())).then(() => dispatch(checkGraduation())).then(() => dispatch(topLevelAction()))
    }

    const clearSemestersOnClick = (e) => {
        e.preventDefault();
        dispatch(clearSemesters()).then(()=> dispatch(updateUserPlanner())).then(() => dispatch(checkGraduation())).then(() => dispatch(topLevelAction()))
    }
    
    return (
        <div className='PlannerContainer'>
            <div className='PlannerHeader'>
                <div className='planner-dropdown-container'>
                    <CourseDropdown />
                </div>      
                
                <h1>Total MCs: {userPlanner.reduce((prev, curr) => prev + (curr.modules.reduce((acc, currValue) => acc + currValue.moduleCredit, 0)), 0)}</h1>
                <h1>Eligible for Graduation: {canGraduate ? "Yes" : "No"}</h1>
            </div>
            
                
                {
                userPlanner.length > 0
                ? <div className='PlannerBody' ref={exportRef}>
                        {userPlanner.map((semester, idx) => <SemesterTile darkMode={darkMode} semesterId={idx} key={semester.title} title={semester.title} modules={semester.modules} />)}
                        <CustomDragLayer />
                    </div>
                : <h3>No semesters added yet. Click "Add New Semester" below to add one!</h3>
                }
            
            <div className='PlannerFooter'>
                <h3><div className='planner-footer-btn' onClick={(e) => {
                    e.preventDefault();
                    setRequirementsActive(!requirementsActive);
                }}>View Course Requirements</div></h3>
                <h3><div className='planner-footer-btn' onClick={clearSemestersOnClick}>Clear All Semester Data</div></h3>
                <h3><div className='planner-footer-btn' onClick={addSemestersOnClick}>Add New Semester</div></h3>
                <h3 className='download-btn'><div className='planner-footer-btn' onClick={onCapture}>Download</div></h3>
            </div>
        </div>
    
    
  );
}

export default PlannerApp;