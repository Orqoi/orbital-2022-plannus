import { faThumbsUp, faThumbsDown, faEllipsis} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/ForumApp.css';
import { useState, useRef, useEffect } from "react";
import PostReply from './PostReply';
import PostComment from './PostComment';
import { dislikeComment, likeComment, reset, editComment} from '../../features/posts/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import LoadingIcons from 'react-loading-icons';
import Moment from 'react-moment';
import PostOptions from './PostOptions';

function PostNew(props) {
  const [commenting, setCommenting] = useState(false);
  const updateCommenting = () => setCommenting(!commenting);
  
  const dispatch = useDispatch();
  const [showPostOptions, setShowPostOptions] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const { isCommentsLoading} = useSelector((state) => state.posts)
  const [repliesDisplayedCount, setRepliesDisplayedCount] = useState(5)
  const [clicked, setClicked] = useState(false)
  const [changeContent, setChangeContent] = useState(props.content)
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref?.current?.contains(event.target)) {
        setShowPostOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const onLike = () => {
    if (!user) {
      toast.error("You are not logged in.");
    }

    if (!user.verified) {
      toast.error("You have not verified your email.");
  }
    dispatch(likeComment(props.commentId)).then(() => {
        dispatch(reset());
    });
  }

  const onDislike = () => {
    if (!user) {
      toast.error("You are not logged in.");
    }
    
    if (!user.verified) {
      toast.error("You have not verified your email.");
  }
    dispatch(dislikeComment(props.commentId)).then(() => {
        dispatch(reset());
    });
  }

  const editUserComment = (content, id) => {
    if (content) {
      dispatch(editComment({commentContent: content, commentId: id})).then(()=> dispatch(reset()))
    }
    setClicked(!clicked)
  }

  const changeContentText = (e) => {
    setChangeContent(e.target.value)
  }

  return (
    <div className="PostNew">
      <div className='PostNewHeader'>
        <div className='PostNewIcon'>
          <img className='OpIcon' src={props.profileImage ? props.profileImage : 'https://res.cloudinary.com/dqreeripf/image/upload/v1656242180/xdqcnyg5zu0y9iijznvf.jpg'} alt='user profile' />
        </div>
        <h5 className='PostNewAuthor'>{props.author}</h5>
        <h5 className='PostNewTime'>{props.time} ({props.replies.length} replies)</h5>
      </div>
      <div className='PostNewContent'>
        <div>
          {
            !clicked 
            ? props.content 
            : <div className='edit-container'>
                <textarea 
                  autoFocus 
                  onFocus={(e) => e.target.setSelectionRange(changeContent.length, changeContent.length)} 
                  className='edit-area' 
                  onChange={changeContentText}
                  defaultValue={changeContent}>
                  
                </textarea>
                <div className='edit-btn-container'>
                  <input onClick={() => editUserComment(changeContent, props.commentId)} value='Save' required type="submit" />
                  <input onClick={() => setClicked(!clicked)} value='Cancel' required type="button" />
                </div>
                
              </div>
          }
        </div>
      </div>
      <div className='PostNewFooter'>
      <div className='PostNewFooterVotes'>
        {
          isCommentsLoading
          ? <LoadingIcons.ThreeDots height="0.5rem" width="4.9rem" fill="#000000" />
          : <>
              <FontAwesomeIcon icon={faThumbsUp} className="PostNewVoteIcon" id='LikeButton' 
                style={user && props.likes.includes(user._id) ? {color:'var(--color-accepted)'} : {color:'inherit'}} onClick={onLike}/>
              <h5 className='PostNewVoteIcon'>{props.likes.length}</h5>
              <FontAwesomeIcon icon={faThumbsDown} className="PostNewVoteIcon" id='DislikeButton' 
                style={user && props.dislikes.includes(user._id) ? {color:'var(--color-remove)'} : {color:'inherit'}} onClick={onDislike}/>
              <h5 className='PostNewVoteIcon'>{props.dislikes.length}</h5>
            </>
        }
        
      </div>

        
        

        <button onClick={updateCommenting}>Reply</button>
        <div className='more-options-btn' ref={ref} onClick={() => setShowPostOptions(!showPostOptions)}>
          <FontAwesomeIcon icon={faEllipsis}/>
            {
              showPostOptions 
              ? <div className='post-options-container'>
                  <PostOptions isClicked = {clicked} setIsClicked = {setClicked} author = {props.author} commentId = {props.commentId} commentMaker = {props.author._id} referPost = {false} referComment = {true} referReply = {false}/>
                </div> 
              : <></>
            }
        </div>
      </div>
      {commenting ? <PostComment commentId={props.commentId} commentAuthor={props.author} updateCommenting={updateCommenting} reply={true}/> : <></>}
      <div className='PostNewRepliesContainer'>
        {props.replies.slice(0, repliesDisplayedCount).map((reply) => 
          <PostReply key={reply._id} commentId={props.commentId} commentAuthor={props.author} replyId={reply._id} likes={reply.likes} dislikes={reply.dislikes}
          content={reply.content} profileImage={reply.author.profileImage} author={reply.author.name} time={<Moment fromNow>{reply.createdAt}</Moment>}/>)}
        {
              repliesDisplayedCount >= props.replies.length
              ? <></>
              : <h4 className='show-more-btn' onClick={() => repliesDisplayedCount + 5 > props.replies.length ? setRepliesDisplayedCount(props.replies.length) : setRepliesDisplayedCount(repliesDisplayedCount + 5)}>
                  Show more replies
                </h4>
            }
      </div>
    </div>
  );
}

export default PostNew;