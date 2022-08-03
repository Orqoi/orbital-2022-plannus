import '../../assets/ForumApp.css';
import PostComment from './PostComment.js';
import PostOp from './PostOp';
import PostNew from './PostNew';
import { useEffect, useState } from "react";
import Moment from 'react-moment';
import { useDispatch, useSelector} from 'react-redux'
import {getSpecificPost, reset }from "../../features/posts/postSlice";
import { useParams } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons';

function ForumPostPage() {
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSpecificPost(params.id)).then(() => dispatch(reset()))
  }, [dispatch, params.id])

  const { currentPost } = useSelector((state) => state.posts);
  const [commentsDisplayedCount, setCommentsDisplayedCount] = useState(5)

  return (
    <div className="ForumPostPage">
      {
        currentPost !== null
        ? <div className='ForumPostPageContainer'>
            <PostOp title={currentPost.title} likes={currentPost.likes} dislikes={currentPost.dislikes} pinned={true} 
            content={currentPost.content} profileImage={currentPost.user.profileImage} id = {currentPost.user._id}
            author={currentPost.user.name} time={<Moment fromNow>{currentPost.createdAt}</Moment>} images={currentPost.images} comments={currentPost.comments}/>
            <PostComment reply={false} />
            {currentPost.comments.slice(0, commentsDisplayedCount).map((comment) => 
              <PostNew key={comment._id} commentId={comment._id} replies={comment.replies} likes={comment.likes} 
              dislikes={comment.dislikes} profileImage={comment.author.profileImage} content={comment.content} author={comment.author.name} time={<Moment fromNow>{comment.createdAt}</Moment>}/>)
            }
            {
              commentsDisplayedCount >= currentPost.comments.length
              ? <></>
              : <h4 className='show-more-btn' onClick={() => commentsDisplayedCount + 5 > currentPost.comments.length ? setCommentsDisplayedCount(currentPost.comments.length) : setCommentsDisplayedCount(commentsDisplayedCount + 5)}>
                  Show more comments
                </h4>
            }
            
          </div>
        :  <LoadingIcons.ThreeDots fill="#000000" />
      }
    </div>
  );
}

export default ForumPostPage;