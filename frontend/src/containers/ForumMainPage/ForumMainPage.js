import '../../assets/ForumApp.css';
import ForumPost from './ForumPost.js';
import {Link, useNavigate} from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux';
import {getPosts, reset, sortByLikes, sortByComments, sortByTime }from "../../features/posts/postSlice";
import {reset as resetUser} from "../../features/auth/authSlice"
import React, { useEffect }  from 'react';
import Moment from 'react-moment';
import LoadingIcons from 'react-loading-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmileBeam, faFire, faImage, faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

function ForumMainPage({posts}) {
  
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const {user, isSuccess, isError, message} = useSelector((state) => state.auth)
  const {isLoading, hasMorePosts, sortBy } = useSelector((state) => state.posts)


  useEffect(() => {
    window.onscroll = () => {
      if (((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 10)) && hasMorePosts) {
        const updatedBySorter = false;
        dispatch(getPosts({
          postLength: posts.length,
          updatedBySorter: updatedBySorter
        })).then(() => dispatch(reset()))
     }
    }

    return () => {window.onscroll = null}
  })

  useEffect(() => {
    if (isSuccess) {
        toast.success(message)
    }


    if (isError) {
      toast.error(message)
    }
    // dispatch(getPosts({
    //   postLength: props.posts.length,
    //   updatedBySorter: false
    // })).then(() => dispatch(reset()))

    dispatch(resetUser())
  }, [dispatch, isSuccess, message, isError])

  const sortByLikesOnclick = () => {
    const updatedBySorter = true;
    dispatch(sortByLikes())
    dispatch(getPosts({
      postLength: posts.length,
      updatedBySorter: updatedBySorter
    })).then(() => dispatch(reset()))
  }

  const sortByCommentsOnclick = () => {
    const updatedBySorter = true;
    dispatch(sortByComments())
    dispatch(getPosts({
      postLength: posts.length,
      updatedBySorter: updatedBySorter
    })).then(() => dispatch(reset()))
  }

  const sortByTimeOnclick = () => {
    const updatedBySorter = true;
    dispatch(sortByTime())
    dispatch(getPosts({
      postLength: posts.length,
      updatedBySorter: updatedBySorter
    })).then(() => dispatch(reset()))
  }
  

  const userCheck = () => {
    if (!user) {
      navigate('/login')
    } else if (!user.verified){
      navigate('/blocked')
    } else {
      navigate('/forum/create')
    }
  }

  return (
    <div className="ForumMainPage">
      <div className="ForumButtons">
        <div className="new-thread-container forum-group">
          <div className='new-thread-user-icon'>
            <Link to='/settings'>
              <img src={user && user.profileImage ? user.profileImage : 'https://res.cloudinary.com/dqreeripf/image/upload/v1656242180/xdqcnyg5zu0y9iijznvf.jpg'} alt='user profile' />
            </Link>
          </div>
          <textarea onClick={userCheck} placeholder='Create a new thread' style={{'resize' : 'none'}}></textarea>
          <div className='new-thread-attachments' onClick={userCheck}><FontAwesomeIcon icon={faImage} /></div>
      
        </div>
        <div className='sorting-buttons-container forum-group'>
          <button style={sortBy === 'Comments' ? {'color': 'var(--color-text-secondary)', 'backgroundColor': 'var(--color-input-tertiary)'} : {}} onClick={sortByCommentsOnclick}>
            <FontAwesomeIcon icon={faFire} /> Most Commented
          </button>
          <button style={sortBy === 'Likes' ? {'color': 'var(--color-text-secondary)', 'backgroundColor': 'var(--color-input-tertiary)'} : {}} onClick={sortByLikesOnclick}>
            <FontAwesomeIcon icon={faFaceSmileBeam} /> Most Liked
          </button>
          <button style={sortBy === 'Time' ? {'color': 'var(--color-text-secondary)', 'backgroundColor': 'var(--color-input-tertiary)'} : {}} onClick={sortByTimeOnclick}>
            <FontAwesomeIcon icon={faSprayCanSparkles} /> Most Recent
          </button>
        </div>
        
        
      </div>
      <div className="ForumPostContainer">
        {posts.map((post, idx) => <ForumPost key={post._id} title={post.title} likes={post.likes} comments={post.comments}
        dislikes={post.dislikes} pinned={post.pinned} content={post.content} author={post.user.name} time={<Moment fromNow>{post.createdAt}</Moment>} id={post._id}/>)}
        {isLoading ? <LoadingIcons.ThreeDots fill="#000000" /> : <></>}
        {!hasMorePosts ? <h1 style={{"marginBottom": "1.5rem"}}>No more posts to display</h1> : <></>}
      </div>
      
    </div>
  );
}

export default ForumMainPage;