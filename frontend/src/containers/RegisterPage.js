import {useState, useEffect} from 'react' 
import {useSelector, useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import {register, reset} from "../features/auth/authSlice"
import '../assets/Login.css';
import successLogo from '../assets/Success.png'
import LoadingIcons from 'react-loading-icons';

function RegisterPage() {

  const [verify, setVerify] = useState(false)
  const [formData, setFormData] = useState({
      name: '',
      email:'',
      password: '',
      password2: '' // Confirm password
  })

  const {name, email, password, password2} = formData

  const dispatch = useDispatch()

  const {user, isLoading, isSuccess, isError, message} = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
        toast.error(message)
    }

    if (isSuccess) {
        setVerify(true)
    }

    dispatch(reset())
  }, [user, isError, message, dispatch, isSuccess])

  const onChange = (e) => {
      setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
      }))
  }

  const onSubmit = (e) => {
      e.preventDefault()

      if (password !== password2) {
          toast.error('Passwords do not match')
      } else {
          const url = window.location.href
          const userData = {name, email, password, url}
          dispatch(register(userData))
      }
  }

  if(isLoading) {
      return <LoadingIcons.ThreeDots fill="#000000" />
  }

  return (
    <div className='RegisterPage'>
        {verify ? <><img src={successLogo} alt='Success Logo'/> <h1>A verification email has been sent. Please check your inbox including your spam folder.</h1></>: <>
        <div className='register-container'>
            <section className='register-heading'>
                <h1>Register</h1>
            </section>
            <section className="register-form-container">
                <form className='register-form' onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input 
                            type = 'text' 
                            className ='form-control' 
                            id='name' 
                            name = 'name' 
                            value = {name} 
                            placeholder='Enter your username' 
                            onChange = {onChange}/>
                    </div>
                    <div className='form-group'>
                        <input 
                            type = 'email' 
                            className ='form-control' 
                            id='email' 
                            name = 'email' 
                            value = {email} 
                            placeholder='Enter your email' 
                            onChange = {onChange}/>
                    </div>
                    <div className='form-group'>
                        <input 
                            type = 'password' 
                            className ='form-control' 
                            id='password' 
                            name = 'password' 
                            value = {password} 
                            placeholder='Enter your password' 
                            onChange = {onChange}/>
                    </div>
                    <div className='form-group'>
                        <input 
                            type = 'password' 
                            className ='form-control' 
                            id='password2' 
                            name = 'password2' 
                            value = {password2} 
                            placeholder='Confirm password' 
                            onChange = {onChange}/>
                    </div>
                    <div className='register-buttons'>
                        <button type="submit">Register</button>
                    </div>
                </form>
            </section>
        </div></>}
    </div>
    )
}

export default RegisterPage