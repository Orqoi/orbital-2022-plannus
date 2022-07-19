import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faCaretUp, faCaretDown, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import '../../assets/ForumApp.css';
import {useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { deletePosts, dislikePosts, likePosts, reset, editPost} from '../../features/posts/postSlice';
import { toast } from 'react-toastify';
import LoadingIcons from 'react-loading-icons';


function PostOp(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentPost, isVotesLoading } = useSelector((state) => state.posts);
  const [changeContent, setChangeContent] = useState(`${currentPost.content}`)
  const [clicked, setClicked] = useState(false)
  const onLike = (e) => {
    if (!user) {
        toast.error("You are not logged in.");
    }
    if (!user.verified) {
      toast.error("You have not verified your email.");
    }
    dispatch(likePosts(currentPost._id)).then(() => {
        dispatch(reset());
    });
}

const onDislike = (e) => {
    if (!user) {
        toast.error("You are not logged in.");
    }
    if (!user.verified) {
      toast.error("You have not verified your email.");
    }
    dispatch(dislikePosts(currentPost._id)).then(() => {
        dispatch(reset());
    });
}
const deleteUserPosts = (id) => {
    dispatch(deletePosts(id)).then(()=> dispatch(reset())).then(navigate('/forum'))
}

const editContent = (content) => {
    dispatch(editPost(content)).then(()=>dispatch(reset()))
    setClicked(!clicked)
}

const changeContentText = (e) => {
    setChangeContent(e.target.value)
}


  return (
    <div className="PostOp">
        <div className='VoteButtons'>
          <FontAwesomeIcon role="button" icon={faCaretUp} onClick={onLike} className="UpvoteBtn" style={user && props.likes.includes(user._id) ? {color:'var(--color-accept)'} : {color:'inherit'}} />
          {isVotesLoading ? <LoadingIcons.ThreeDots width="2rem" fill="#000000" /> : <h3>{props.likes.length - props.dislikes.length}</h3>}
          <FontAwesomeIcon role="button" icon={faCaretDown} onClick={onDislike} className="DownvoteBtn" style={user && props.dislikes.includes(user._id) ? {color:'var(--color-remove)'} : {color:'inherit'}} />
        </div>
        <div className='PostOpContent'>
          <div className='PostOpAuthorContainer'>
            <img className='OpIcon' src={props.profileImage ? props.profileImage : 'https://res.cloudinary.com/dqreeripf/image/upload/v1656242180/xdqcnyg5zu0y9iijznvf.jpg'} alt='user profile' />
            <h6> by {props.author} {props.time}</h6>
            {user.name === props.author ? <FontAwesomeIcon className="deleteIcon" onClick = {() => deleteUserPosts(currentPost._id)}icon={faTrashCan}/> : <></>}
            {user.name === props.author ? <FontAwesomeIcon className="editIcon" onClick = {() => setClicked(!clicked)}icon={faPenToSquare}/> : <></>}
          </div>
          
          <h3>{props.title}</h3>
          <p>{!clicked ? props.content : <><textarea id='text' onChange={changeContentText} cols="30" rows="5">{changeContent}</textarea> <input onClick={() => editContent(changeContent)} value='Save' required type="submit" /></>}</p>
          {
            props.images.map(imageUrl =>
              <img className='forum-post-img' src={imageUrl} alt='post media' />
            )
          }
          <div className='PostOpFooter'>
            <h4><FontAwesomeIcon icon={faCommentDots} className="CommentIcon" /> {props.comments.length} Comments</h4>
          </div>
        </div>
        
    </div>
  );
}

export default PostOp;