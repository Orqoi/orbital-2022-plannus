import '../../assets/ForumApp.css';
import { faThumbsUp, faThumbsDown, faEllipsis} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/ForumApp.css';
import { useState, useRef, useEffect } from "react";
import PostComment from './PostComment';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { dislikeReply, likeReply, reset, editReply} from '../../features/posts/postSlice';
import LoadingIcons from 'react-loading-icons';
import PostOptions from './PostOptions';

function PostReply(props) {
    const dispatch = useDispatch();
    const [showPostOptions, setShowPostOptions] = useState(false)
    const [commenting, setCommenting] = useState(false);
    const updateCommenting = () => setCommenting(!commenting);
    const { user } = useSelector((state) => state.auth)
    const { isRepliesLoading} = useSelector((state) => state.posts)
    const content = props.content
    const index = content.indexOf(" ")
    const contentReply = content.slice(index + 1)
    const [changeContent, setChangeContent] = useState(contentReply)
    const [clicked, setClicked] = useState(false)

    const ref = useRef();

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!ref?.current?.contains(event.target)) {
          setShowPostOptions(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
    }, [ref]);

    const onLikeReply = () => {
      if (!user) {
        toast.error("You are not logged in.");
      }
      if (!user.verified) {
        toast.error("You have not verified your email.");
    }
      dispatch(likeReply(props.replyId)).then(() => {
          dispatch(reset());
      });
    }
  
    const onDislikeReply = () => {
      if (!user) {
        toast.error("You are not logged in.");
      }
      if (!user.verified) {
        toast.error("You have not verified your email.");
      }
      dispatch(dislikeReply(props.replyId)).then(() => {
          dispatch(reset());
      });
  
    }
  
    const editUserReply = (content, rId, cId) => {
      if (content) {
        const replyContent = "@" + props.commentAuthor.name + " " + content
        dispatch(editReply({replyContent: replyContent, replyId: rId, commentId: cId})).then(()=>dispatch(reset()))
      }
      setClicked(!clicked)
    }
  
    const changeContentText = (e) => {
        setChangeContent(e.target.value)
    }


    return (
        <div className="PostReply PostNew">
          <div className='PostNewHeader'>
            <div className='PostNewIcon'>
              <img className='OpIcon' src={props.profileImage ? props.profileImage : 'https://res.cloudinary.com/dqreeripf/image/upload/v1656242180/xdqcnyg5zu0y9iijznvf.jpg'} alt='user profile' />
            </div>
            <h5 className='PostNewAuthor'>{props.author}</h5>
            <h5 className='PostNewTime'>{props.time}</h5>
            
          </div>
          <div className='PostNewContent'>
            <div>
              {
                !clicked 
                ? props.content 
                : <div className='edit-container'>
                    <textarea 
                      autoFocus 
                      className='edit-area' 
                      onFocus={(e) => e.target.setSelectionRange(changeContent.length, changeContent.length)} 
                      defaultValue={changeContent}
                      onChange={changeContentText}>
                    </textarea>
                    <div className='edit-btn-container'>
                      <input onClick={() => editUserReply(changeContent, props.replyId, props.commentId)} value='Save' required type="submit" />
                      <input onClick={() => setClicked(!clicked)} value='Cancel' required type="button" />
                    </div>
                    
                  </div>
              }
            </div>
          </div>
          <div className='PostNewFooter'>
            
            <div className='PostNewFooterVotes'>
            {
              isRepliesLoading
              ? <LoadingIcons.ThreeDots height="0.5rem" width="4.9rem" fill="#000000" />
              : <>
                  <FontAwesomeIcon icon={faThumbsUp} className="PostNewVoteIcon" id='LikeButton' 
                    style={user && props.likes.includes(user._id) ? {color:'var(--color-accepted)'} : {color:'inherit'}} onClick={onLikeReply}/>
                  <h5 className='PostNewVoteIcon'>{props.likes.length}</h5>
                  <FontAwesomeIcon icon={faThumbsDown} className="PostNewVoteIcon" id='DislikeButton' 
                    style={user && props.dislikes.includes(user._id) ? {color:'var(--color-remove)'} : {color:'inherit'}} onClick={onDislikeReply}/>
                  <h5 className='PostNewVoteIcon'>{props.dislikes.length}</h5>
                </>
            }
              
            </div>
            

            <button onClick={updateCommenting}>Reply</button>
             
            <div className='more-options-btn' ref={ref} onClick={() => setShowPostOptions(!showPostOptions)}>
              <FontAwesomeIcon icon={faEllipsis}/>
              {
                showPostOptions 
                ? <div className='post-options-container' >
                    <PostOptions isClicked = {clicked} setIsClicked = {setClicked} author = {props.author }replyMaker = {props.author._id} commentId = {props.commentId} replyId = {props.replyId} referPost = {false} referComment = {false} referReply = {true}/>
                  </div> 
                : <></>
              }
            </div>
          </div>
          {commenting ? <PostComment commentId={props.commentId} commentAuthor={props.author} updateCommenting={updateCommenting} reply={true}/> : <></>}
        </div>
      );
}

export default PostReply;