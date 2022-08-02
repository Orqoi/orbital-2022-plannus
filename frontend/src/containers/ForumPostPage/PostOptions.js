import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  faTrashCan, faPenToSquare, faFlag, faBan, faThumbTack} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deletePosts, reset, pinPost, unpinPost, deleteComment, deleteReply} from '../../features/posts/postSlice';
import { banUser, reset as resetUser} from '../../features/auth/authSlice';
import { useState} from "react";
import '../../assets/ForumApp.css';

function PostOptions(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { currentPost} = useSelector((state) => state.posts);
    const [pinned, setPinned] = useState(currentPost.pinned)

    const deleteUserPosts = (id) => {
        dispatch(deletePosts(id)).then(()=> dispatch(reset())).then(navigate('/forum'))
    }
    const banThreadUser = (id) => {
        dispatch(banUser(id))
        navigate('/forum')
    }

    const deleteUserComment = (id) => {
        dispatch(deleteComment(id)).then(()=> dispatch(reset()))
    }

    const banCommentUser = (id) => {
        dispatch(banUser(id)).then(()=> dispatch(resetUser()))
    }

    const banReplyUser = (id) => {
        dispatch(banUser(id)).then(()=>dispatch(resetUser()))
    }

    const deleteUserReply = (postData) => {
        dispatch(deleteReply(postData)).then(()=> dispatch(reset()))
    }



    const decidePin = (bool) => {
        if (!bool) {
            dispatch(pinPost(currentPost._id)).then(() => {
                dispatch(reset());
            });
            setPinned(!bool)
        } else {
            dispatch(unpinPost(currentPost._id)).then(() => {
                dispatch(reset());
            });
            setPinned(!bool)
        }
    }
    return ( 
        <>
            {props.referPost ? !user ? <span onClick={() => navigate('/report')}>
                                            <FontAwesomeIcon className="reportIcon" icon={faFlag} />
                                            Report
                                          </span> : 
                      user.name === props.author
                      ? <>
                          <span onClick = {() => deleteUserPosts(currentPost._id)}>
                            <FontAwesomeIcon className="deleteIcon" icon={faTrashCan} />
                            Delete
                          </span>
                          
                          <span onClick = {() => props.setIsClicked(!props.isClicked)}>
                            <FontAwesomeIcon className="editIcon" icon={faPenToSquare}  />
                            Edit
                          </span>
                        </>
                      : user.moderator ?  <><span onClick={() => banThreadUser(props.id)}>
                                            <FontAwesomeIcon className="banIcon" icon={faBan} />
                                            Ban
                                          </span>
                                            {pinned ? <span onClick={() => decidePin(pinned)}>
                                            <FontAwesomeIcon className="pinIcon" icon={faThumbTack} />
                                            Unpin
                                          </span> : <span onClick={() => decidePin(pinned)}>
                                            <FontAwesomeIcon className="pinIcon" icon={faThumbTack} />
                                            Pin
                                          </span>}
                                          <span onClick = {() => deleteUserPosts(currentPost._id)}>
                                            <FontAwesomeIcon className="deleteIcon" icon={faTrashCan} />
                                            Delete
                                         </span></>
                                        : <span onClick={() => navigate('/report')}>
                                            <FontAwesomeIcon className="reportIcon" icon={faFlag} />
                                            Report
                                          </span>
            : props.referComment ? !user ? <span onClick={() => navigate('/report')}>
                                            <FontAwesomeIcon className="reportIcon" icon={faFlag} />
                                            Report
                                          </span>
                                   : 
                      user.name === props.author
                      ? <>
                          <span onClick={() => deleteUserComment(props.commentId)}>
                            <FontAwesomeIcon className="deleteIcon" icon={faTrashCan} />
                            Delete
                          </span>
                          
                          <span onClick = {() => props.setIsClicked(!props.isClicked)}>
                            <FontAwesomeIcon className="editIcon" icon={faPenToSquare}  /> 
                            Edit
                          </span>
                        </>
                      :  user.moderator ? <><span onClick={() => banCommentUser(props.commentMaker)}>
                                            <FontAwesomeIcon className="banIcon" icon={faBan} />
                                            Ban
                                          </span>
                                          <span onClick={() => deleteUserComment(props.commentId)}>
                                            <FontAwesomeIcon className="deleteIcon" icon={faTrashCan} />
                                            Delete
                                          </span></>
                                        : <span onClick={() => navigate('/report')}>
                                            <FontAwesomeIcon className="reportIcon" icon={faFlag} />
                                            Report
                                          </span>
                           : !user ? <span onClick={() => navigate('/report')}>
                                          <FontAwesomeIcon className="reportIcon" icon={faFlag} />
                                          Report
                                         </span>: 
                      user.name === props.author
                      ? <>
                          <span onClick={()=>deleteUserReply({replyId: props.replyId, commentId: props.commentId})}>
                            <FontAwesomeIcon className="deleteIcon" icon={faTrashCan} />
                            Delete
                          </span>
                          
                          <span onClick = {() => props.setIsClicked(!props.isClicked)}>
                        
                            <FontAwesomeIcon className="editIcon" icon={faPenToSquare}  />
                            Edit
                          </span>
                        </>
                      : user.moderator ? <><span onClick={() => banReplyUser(props.replyMaker)}>
                                          <FontAwesomeIcon className="banIcon" icon={faBan} />
                                          Ban
                                         </span>
                                         <span onClick={()=>deleteUserReply({replyId: props.replyId, commentId: props.commentId})}>
                                          <FontAwesomeIcon className="deleteIcon" icon={faTrashCan} />
                                          Delete
                                        </span> </>
                                       : <span onClick={() => navigate('/report')}>
                                          <FontAwesomeIcon className="reportIcon" icon={faFlag} />
                                          Report
                                         </span>}
        </>
    );

}


export default PostOptions;