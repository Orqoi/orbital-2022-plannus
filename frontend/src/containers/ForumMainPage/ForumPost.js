import { faThumbsDown, faThumbsUp, faThumbtack } from '@fortawesome/free-solid-svg-icons';

import LoadingIcons from 'react-loading-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/ForumApp.css';
import { Link } from 'react-router-dom';
import {likePosts, dislikePosts, reset, updateSort} from "../../features/posts/postSlice";
import {useSelector, useDispatch} from 'react-redux';
import { toast } from 'react-toastify';

// import axios from 'axios';

function ForumPost({id, title, pinned, content, author, time, comments, likes, dislikes}) {

    const {user} = useSelector((state) => state.auth);
    const {isVotesLoading} = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    const onLike = (e) => {
        if (!user) {
            toast.error("You are not logged in.");
        }

        if (!user.verified) {
            toast.error("You have not verified your email.");
        }
        // const helper = axios.get("api/req/temp");
        dispatch(likePosts(id)).then(() => {
            dispatch(updateSort());
        }).then(() => {
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
        dispatch(dislikePosts(id)).then(() => {
            dispatch(updateSort());
        }).then(() => {
            dispatch(reset());
        });
    }
    

  return (
        <div className="ForumPost">
            <Link to={`/forum/${id}`}  className='ForumPostMain'>
                <div className='ForumPostHeader'>
                    <h1>{title}</h1>
                    {pinned ?
                    (
                        <div className='pinContainer'>
                            <FontAwesomeIcon icon={faThumbtack}/>
                            <h1>Pinned</h1>
                        </div>
                    ) :
                    <></>}
                    
                </div>
                <div className='ForumPostContent'>
                    <p>
                    {content.length > 1000 ? content.substring(0, 1000) + " ..." : content}
                    </p>
                </div>
            </Link>
            
            <div className='ForumPostFooter'>
                <div className='ForumPostAuthorTitle'>
                    <p>by {author} {time} ({comments.length} comments)</p>
                </div>
                <div className='ForumPostScore'>
                    {isVotesLoading
                    ? <LoadingIcons.ThreeDots height="1rem" fill= '#000000'/>
                    : <>
                        <div className="LikesContainer">
                            <FontAwesomeIcon icon={faThumbsUp} className="ScoreButton" id='LikeButton' 
                                style={user && likes.includes(user._id) ? {color:'var(--color-accept)'} : {color:'inherit'}} onClick={onLike}/>
                            <p>{likes.length}</p>
                        </div>
                        <div className="DislikesContainer">
                            <FontAwesomeIcon icon={faThumbsDown} className="ScoreButton" id='DislikeButton' 
                                style={user && dislikes.includes(user._id) ? {color:'var(--color-remove)'} : {color:'inherit'}} onClick={onDislike}/>
                            <p>{dislikes.length}</p>
                        </div>
                    </>
                    }
                    
                </div>
            </div>
        </div>
  );
}

export default ForumPost;