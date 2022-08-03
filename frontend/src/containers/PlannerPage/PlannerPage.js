import '../../assets/PlannerApp.css';
import PlannerApp from './PlannerApp';
import RequirementsApp from './RequirementsApp';
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { reset } from "../../features/modules/moduleSlice"
import { reset as resetUser } from "../../features/auth/authSlice"
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';


function PlannerPage({darkMode}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const topLevelAction = () => dispatch => {
      return Promise.all([dispatch(reset()), dispatch(resetUser())])
    }
    const { isWarning, isError, message } = useSelector(state => state.modules)
    const { user, isError: error, message: errorMessage } = useSelector(state => state.auth)  

      useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (error) {
            toast.error(errorMessage)
        }
        if (isWarning) {
          toast.warning(message)
        }

        if(!user) {
          navigate('/login')
        } else {
          if (!user.verified) {
            navigate('/blocked')
          }
        }
        dispatch(topLevelAction())
    }, [isError, isWarning, message, dispatch, user, navigate, error, errorMessage])

    

    const [requirementsActive, setRequirementsActive] = useState(false);

    return (
    <div className="PlannerPage">
        {requirementsActive 
        ? <RequirementsApp 
            requirementsActive={requirementsActive} setRequirementsActive={setRequirementsActive} /> 
        : <PlannerApp  
              darkMode={darkMode} requirementsActive={requirementsActive} setRequirementsActive={setRequirementsActive} userPlanner={user ? user.planner : []} 
         />}
    </div>
  );
}

export default PlannerPage;