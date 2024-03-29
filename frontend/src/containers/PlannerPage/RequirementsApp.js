import '../../assets/PlannerApp.css';
import { useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import { checkGraduation, setSelectedIndex, reset } from '../../features/modules/moduleSlice';
import { useState } from 'react';




function RequirementsApp(props) {

    const {selectedRequirementIndex, requirements } = useSelector(state => state.modules)
    const {planner} = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const [showUnfulfilled, setShowUnfulfilled] = useState(true);
    let modulesTaken = []
    planner.forEach(semester => {
        modulesTaken = modulesTaken.concat(semester.modules)
    })

    const changeEv = (e) => {
        dispatch(setSelectedIndex(e.currentTarget.value)).then(() => dispatch(checkGraduation())).then(()=> dispatch(reset()))
    }

    const moduleFulfilled = (modulesTaken, criteriaModule) => {
        function satisfies(moduleString, module) {
            return moduleString.includes("%") ? module.includes(moduleString.replace(/%/g, '')) : module === moduleString;
          }
        return modulesTaken.filter(module => satisfies(criteriaModule.moduleCode, module.moduleCode)).length > 0
    }

    console.log(requirements)
  return (
    <div className='RequirementsApp'>
        
        <div className='PlannerHeader RequirementsHeader'>
            <div className='selected-course-container'>
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
            </div>
            <div className='toggle-btn'>
                <h3>Toggle Unfulfilled Requirements</h3>
                <label className="switch">
                    <input type="checkbox" onClick={() => setShowUnfulfilled(!showUnfulfilled)}/>
                    <span className="slider round"></span>
                </label>
            </div>
            
            
        </div>
        <div className='RequirementsBody'>
            {
                requirements 
                ? requirements[selectedRequirementIndex].requirements.map((requirement, idx) =>
                    <div key={idx} className='requirement-container'>
                        <h1>{requirement.heading} - {requirement.totalCredits} MCs</h1>
                        {requirement.note ? <h4>{requirement.note}</h4> : <></>}
                        {
                            requirement.subHeadings 
                            ? requirement.subHeadings.map((subheading, idx) => 
                                <div key={idx} className='subrequirement-container'>
                                    <h3 className='subrequirement-heading'>{subheading.subHeadingTitle} - {subheading.subHeadingTotalCredits} MCs</h3>
                                    
                                    <div className='subrequirement-modules-container'>
                                        {subheading.note ? <h4>{subheading.note}</h4> : <></>}
                                        {subheading.subHeadingCriteria.map((criteria, idx) =>
                                            <div key={idx}>
                                                {criteria.criteriaTitle ? <h2 className='criteria-header'>{criteria.criteriaTitle} - {criteria.criteriaCredits} MCs</h2> : <></>}
                                                {criteria.note ? <h4>{criteria.note}</h4> : <></>}
                                                <ul className='criteria-modules'>
                                                    {criteria.modules.map((criteriaModule, idx) =>
                                                        moduleFulfilled(modulesTaken, criteriaModule) 
                                                        ? <li key={idx} style={{color : 'var(--color-accept)'}}>
                                                            {criteriaModule.moduleCode} {criteriaModule.name} {criteriaModule.moduleCredit} MC
                                                          </li>
                                                        : showUnfulfilled
                                                          ? <li key={idx} style={{color : 'inherit'}}>
                                                              {criteriaModule.moduleCode} {criteriaModule.name} {criteriaModule.moduleCredit} MC
                                                            </li>
                                                          : <></>
                                                        )
                                                    }
                                                </ul>
                                                
                                            </div>
                                        )}
                                    </div>
                                </div>)
                            : <></>
                        }
                    </div>)
                : <></>
            }
            
        </div>
        <div className='RequirementsFooter'>
            <h3><div className='planner-footer-btn' onClick={(e) => {
                    e.preventDefault();
                    props.setRequirementsActive(!props.requirementsActive);
                }}>Back to Planner</div></h3>
        </div>
    </div>
    
  );
}




export default RequirementsApp;