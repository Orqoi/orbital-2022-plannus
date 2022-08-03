import '../../assets/PlannerApp.css';
import { useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import { checkGraduation, setSelectedIndex, reset } from '../../features/modules/moduleSlice';



function CourseDropdown() {
    const {selectedRequirementIndex, requirements } = useSelector(state => state.modules)
    const dispatch = useDispatch()

    const changeEv = (e) => {
        dispatch(setSelectedIndex(e.currentTarget.value)).then(() => dispatch(checkGraduation())).then(()=> dispatch(reset()))
    }
    return (
        <>
        <select defaultValue={selectedRequirementIndex} name="courses" id="courses" onChange={e => changeEv(e)}>
                    <optgroup label="Single Major Programmes">
                        {
                            requirements.map((courseData, idx) => 
                                courseData.degreeType === "SingleMajor"
                                ?   <option 
                                        selected={idx === selectedRequirementIndex ? true : false} 
                                        key={courseData.title} 
                                        value={idx}>
                                    {courseData.title}
                                    </option>
                                : <></>
                            )
                        }
                    </optgroup>
                    <optgroup label="Double Major Programmes">
                        {
                            requirements.map((courseData, idx) => 
                                courseData.degreeType === "DoubleMajor"
                                ?   <option 
                                        selected={idx === selectedRequirementIndex ? true : false} 
                                        key={courseData.title} 
                                        value={idx}>
                                    {courseData.title}
                                    </option>
                                : <></>
                            )
                        }
                    </optgroup>
                </select>
        </>
    );
}

export default CourseDropdown;