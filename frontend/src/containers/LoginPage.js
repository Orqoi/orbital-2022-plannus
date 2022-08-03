import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {login, reset} from "../features/auth/authSlice";
import '../assets/Login.css';
import teamLogo from '../assets/PlanNUS.png';
import LoadingIcons from 'react-loading-icons';



export default function LoginPage() {

  const [formData, setFormData] = useState({
      username:'',
      password: ''
  })

  const {username, password} = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  useEffect(() => {
    
    if (isError) {
        toast.error(message)
    }

    if (isSuccess || user) {
        navigate('/')
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
      setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
      }))
  }

  const onSubmit = (e) => {
      e.preventDefault()
      const url = window.location.href
      const userData = {
          username,
          password,
          url
      }
      dispatch(login(userData))
      
  }

  const [showPassword, setShowPassword] = useState(false);

  if(isLoading) {
      return <LoadingIcons.ThreeDots fill="#000000" />
  }


  return (
    <div className='LoginPage'>
        <div className='login-container'>
            <section className='login-heading'>
                <img src={teamLogo} alt='PlanNUS Logo'/>
            </section>
            <section className="login-form-container">
                <form onSubmit={onSubmit} className='login-form'>
                    <div className='form-group'>
                        <input 
                            type = 'text' 
                            className ='form-control' 
                            id='username' 
                            name = 'username' 
                            value = {username} 
                            placeholder='Username' 
                            onChange = {onChange}/>
                    </div>
                    <div className='form-group'>
                        <input 
                            type = {showPassword ? 'text' : 'password'} 
                            className ='form-control' 
                            id='password' 
                            name = 'password' 
                            value = {password} 
                            placeholder='Password' 
                            onChange = {onChange}/>
                    </div>
                    <div className='show-password'>
                        <input type="checkbox" id="show" name="show" value="show" onClick={() => setShowPassword(!showPassword)}/> Show Password
                    </div>
                    <div className='login-buttons'>
                        <Link to='/register'>Register</Link>
                        <Link to='/forgot'>Forgot Password?</Link>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </section>
        </div>
    </div>
    )
  
}