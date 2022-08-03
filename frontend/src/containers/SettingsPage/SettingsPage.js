import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import '../../assets/Settings.css';
import '../../assets/App.css';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {getUserPosts, reset} from "../../features/posts/postSlice";
import { updateUserDetails, updateUserImage, reset as resetUser }from "../../features/auth/authSlice";

function SettingsPage({darkMode, toggleDarkMode}) {
    const { user, isSuccess, isError, message } = useSelector((state) => state.auth);
    const { userPosts } = useSelector((state) => state.posts);
    const { requirements } = useSelector(state => state.modules)
    
    const dispatch = useDispatch();
    

    // retrieve posts by user
    useEffect(() => {
        if (user) {
            dispatch(getUserPosts(user._id)).then(() => dispatch(reset()))
        }
        
        if (isSuccess) {
            toast.success(message)
        }

        if (isError) {
            toast.error(message)
        }

        dispatch(resetUser())
    }, [user, dispatch, isSuccess, isError, message])

    // change user information
    
    const [userData, setUserData] = useState({
        name: '',
        email:'',
        password: '',
        password2: '',
        gender: '',
        matriculationYear: 0,
        about: '',
        major: ''
    })

    const {email, password, password2, gender, matriculationYear, about, major} = userData
    const url = window.location.href
    const onChangeDetails = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
        console.log(userData);
    }

    const changeGender = (e) => {
        e.preventDefault()
        const data = {
            gender: userData.gender
        }
        dispatch(updateUserDetails(data)).then(dispatch(resetUser()))
        setUserData((prevState) => ({
            ...prevState,
            gender: ''
        }))
    }

    const changeMatriculationYear = (e) => {
        e.preventDefault()
        const data = {
            matriculationYear: userData.matriculationYear
        }
        dispatch(updateUserDetails(data)).then(dispatch(resetUser()))
        setUserData((prevState) => ({
            ...prevState,
            matriculationYear: 0
        }))
    }

    const changeMajor = (e) => {
        e.preventDefault()
        const data = {
            major: userData.major
        }
        dispatch(updateUserDetails(data)).then(dispatch(resetUser()))
        setUserData((prevState) => ({
            ...prevState,
            major: ''
        }))
    }
    
    const changeAbout = (e) => {
        e.preventDefault()
        const data = {
            about: userData.about
        }
        dispatch(updateUserDetails(data)).then(dispatch(resetUser()))
        setUserData((prevState) => ({
            ...prevState,
            about: ''
        }))
    }

    const changeEmail = (e) => {
        e.preventDefault()
        const data = {
            email: userData.email,
            url: url
        }
        dispatch(updateUserDetails(data)).then(dispatch(resetUser()))
        setUserData((prevState) => ({
            ...prevState,
             email: ''
        }))
    }

    const changePassword = (e) => {
        e.preventDefault()

        if (password !== password2) {
            toast.error('Passwords do not match')
        } else {
            if (user.verified){
                const data = {
                    password: userData.password
                }
                dispatch(updateUserDetails(data)).then(dispatch(resetUser()))
                setUserData((prevState) => ({
                    ...prevState,
                    password: '',
                    password2: '',
                }))
            } else {
                toast.error('Please verify your email first!')
            }
            
        }
    }

    // Change profile pic
    const [fileName, setFileName] = useState("");

    
    const updateProfileImage = (e, img) => {
        e.preventDefault();
        setFileName("")
        // Add update profile request here.
        const formData = new FormData();
        formData.append("image", img);
        formData.append("userId", user._id);
        dispatch(updateUserImage(formData)).then(() => dispatch(resetUser()))
    }


    const updateImage = (e) => {
        updateProfileImage(e, e.target.files[0]);
    }

  return (
    <div className='settings-page-container'>
        {
            user
            ? <>
                <h1 className='settings-page-header'>Profile</h1>
                <div className='settings-page-group'>
                    <h2 className='settings-page-subheader'>Profile Picture</h2>
                    
                    <form className='settings-change-container' encType='multipart/form-data'>
                        <div className='user-image-container'>
                            <img src={user && user.profileImage ? user.profileImage : 'https://res.cloudinary.com/dqreeripf/image/upload/v1656242180/xdqcnyg5zu0y9iijznvf.jpg'} alt='user profile' />
                        </div>
                        <label htmlFor="image">Upload File</label>
                        <input type="file" accept="image/*" name="image" id="image" onChange={updateImage}></input>
                        <span>{fileName ? `Selected File: ${fileName}` : "Only accepts .jpg, .png extensions"}</span>
                    </form>
                    <h2 className='settings-page-subheader'>Basic Information</h2>
                    <form className='settings-change-container'>
                        <h3>
                            Gender:
                            <select name="gender" onChange={onChangeDetails} value={gender ? gender : user.gender}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </h3>
                        <button  onClick={changeGender}>Update</button>
                        <h3>
                            Matriculation Year: 
                            <select name="matriculationYear" onChange={onChangeDetails} value={matriculationYear ? matriculationYear : user.matriculationYear}>
                                <option value={0}>No Matriculation Year Specified</option>
                                {
                                    [...Array(50).keys()].map(year => <option key={year + 2015} value={year + 2015}>{year + 2015}</option>)
                                }
                            </select>
                        </h3>
                        <button  onClick={changeMatriculationYear}>Update</button>
                        <h3>
                            Major:
                            <select name="major" onChange={onChangeDetails} value={major ? major : user.major}>
                                <option value="No Major Specified">No Major Specified</option>
                                {
                                    requirements.map((requirement, idx) => <option value={idx} key={idx}>{requirement.title}</option>)
                                }
                            </select>
                        
                        </h3>
                        <button  onClick={changeMajor}>Update</button>
                    </form>
                    
                    <h2 className='settings-page-subheader'>About</h2>
                    <form className='settings-change-container'>
                        <p>
                            {user.about}
                        </p>
                        <textarea name="about" value={about} onChange={onChangeDetails} placeholder="Add some information about yourself">
                        </textarea>
                        <button  onClick={changeAbout}>Update</button>
                    </form>
                </div>
                <h1 className='settings-page-header'>Security</h1>
                <div className='settings-page-group'>
                    <h2 className='settings-page-subheader'>Change Password</h2>
                    <form className='settings-change-container' onSubmit={changePassword}>
                        <input 
                            type = 'password' 
                            name = 'password' 
                            value = {password} 
                            placeholder='New Password' 
                            onChange = {onChangeDetails}/>
                        <input 
                            type = 'password' 
                            name = 'password2' 
                            value = {password2} 
                            placeholder='Confirm New Password' 
                            onChange = {onChangeDetails}/>
                        <button type="submit">Change</button>
                    </form>
                    <h2 className='settings-page-subheader'>Change Email</h2>
                    <form className='settings-change-container' onSubmit={changeEmail}>
                        {user.verified ? <h3>Current email: {user.email} &#40;Verified&#41;</h3> : <h3>Current email: {user.email} &#40;Not Verified&#41;</h3>}
                        <input 
                            type = 'email' 
                            name = 'email' 
                            value = {email} 
                            placeholder='New Email' 
                            onChange = {onChangeDetails}/>
                        <button type='submit'>Change</button>
                    </form>
                </div>
                <h1 className='settings-page-header'>Activity</h1>
                <div className='settings-page-group'>
                    <h2 className='settings-page-subheader'>Posts</h2>
                    {
                        userPosts && Object.keys(userPosts).length > 0
                        ? userPosts.map(post =>
                            <div className='user-post' key={post._id}>
                                <Link to={`/forum/${post._id}`}>
                                    {post.title} <strong>({post.likes.length} upvotes, {post.dislikes.length} downvotes)</strong>
                                </Link>
                            </div>
                            )
                        : <p>No posts created yet.</p>
                    }
                </div>
              </>
            : <></>
        }

            <h1 className='settings-page-header'>Settings</h1>
            <div className='settings-page-group'>
                <h2 className='settings-page-subheader'>Dark Mode</h2>
                <div className='settings-toggle-container'>
                    <p>
                        Dark mode turns the light surfaces of the page dark, creating an experience ideal for the dark. Try it out!
                    </p>
                    <label className="switch">
                        <input type="checkbox" checked={darkMode} onChange={toggleDarkMode}/>
                        <span className="slider round"></span>
                    </label>
                </div>
                
            </div>
        
    </div>
  )
}

export default SettingsPage