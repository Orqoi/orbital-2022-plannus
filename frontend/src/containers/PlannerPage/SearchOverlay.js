import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/PlannerApp.css';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useSelector } from 'react-redux';
import { addModule, checkGraduation, reset } from '../../features/modules/moduleSlice';
import { updateUserPlanner, reset as resetUser } from '../../features/auth/authSlice';
import { useDispatch} from 'react-redux';



function SearchOverlay({semesterId, semesterTitle, setSearching, searching}) {
     
      // Random color function, purely for development

      // function hashCode(str) { // java String#hashCode
      //   var hash = 0;
      //   for (var i = 0; i < str.length; i++) {
      //      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      //   }
      //   return hash;
      // } 

      const dispatch = useDispatch()
    
    // function intToRGB(i){
    //     var c = (i & 0x00FFFFFF)
    //         .toString(16)
    //         .toUpperCase();
    
    //     return "00000".substring(0, 6 - c.length) + c;
    // }

    const getColourFromModuleCode = (moduleCode) => {//"#" + intToRGB(hashCode(moduleCode))
      const randomRed = Math.floor(Math.random() * 120) + 30;
      const randomGreen = Math.floor(Math.random() * 130) + 40;
      const randomBlue = Math.floor(Math.random() * 140) + 50;
      return `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`;
    }
      
      const { modules} = useSelector(state => state.modules)

      const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
      }
    
      const handleOnHover = (result) => {
        // the item hovered
      }

      const topLevelAction = () => dispatch => {
        return Promise.all([dispatch(reset()), dispatch(resetUser())])
      }
    
      const handleOnSelect = (module) => {
        const moduleWithColor = {
          ...module,
          color: getColourFromModuleCode(module.moduleCode)
        }

        const addModuleData = {
          module: moduleWithColor,
          semesterId: semesterId
        }

        dispatch(addModule(addModuleData)).then(()=> dispatch(updateUserPlanner())).then(() => dispatch(checkGraduation())).then(() => dispatch(topLevelAction()))
        // the item selected
        setSearching(!searching);
      }
    
      const handleOnFocus = () => {
      }
    
      const formatResult = (item) => {
        return (
          <>
            <span style={{ display: 'block', textAlign: 'left' }}>Module Code: {item.moduleCode}</span>
            <span style={{ display: 'block', textAlign: 'left' }}>Module Title: {item.title}</span>
            <span style={{ display: 'block', textAlign: 'left' }}>Module Credits: {item.moduleCredit}</span>
          </>
        )
      }
  return (
    <div className="SearchOverlay">
        <div className='close-container'>
            <FontAwesomeIcon icon={faXmark} className="close-button" onClick={() => setSearching(!searching)}/>
        </div>
        
        <div className='search-container'>
          <ReactSearchAutocomplete
            items={modules.map(module => {
              const newModule = {
                ...module, 
                id: module._id
              }
              return newModule;
            })}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            fuseOptions={{ keys: ["moduleCode"] }}
            resultStringKeyName="moduleCode"
            formatResult={formatResult}
            placeholder={"Add a module to " + semesterTitle + " by module code"}
          />
        </div>
    </div>
  );
}

export default SearchOverlay;