import '../../assets/ForumApp.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { toast } from 'react-toastify';
import { reset, addComment, addReply } from '../../features/posts/postSlice';


function PostComment(props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState('');
  const onClickAddComment = e => {
    e.preventDefault();
    if (commentText) {
      if (!user.verified) {
        toast.error("You have not verified your email")
      }
      // close comment window after submit, if it is a reply
      if (props.updateCommenting && props.reply) {
        const replyData = {
          replyText: "@" + props.commentAuthor + " " + commentText,
          commentId: props.commentId,
        }
        
        dispatch(addReply(replyData)).then(() => dispatch(reset()))
        props.updateCommenting();
      } else {
        dispatch(addComment(commentText)).then(() => dispatch(reset()))
      }

      // reset commenting form
      document.getElementById('text').value = '';
      setCommentText('');
    } else {
      toast.error("Please add some content to your comment.")
    }
  };

  //update and retrieve textbox value
  const onChange = e => setCommentText(e.target.value);

  return (
    <form className="PostComment">
      {user
      ? <>
          <h6>{props.reply ? 'Replying to ' + props.commentAuthor : 'Commenting'} as {user.name}</h6>
          <textarea id='text' onChange={onChange} cols="30" rows="5" placeholder='What are your thoughts?'></textarea>
          <input onClick={onClickAddComment} value={props.reply ? 'Post Reply' : 'Post Comment'} required type="submit" />
        </>
      : <h3>You are not logged in. <Link to='/login'>Login</Link> to {props.reply ? 'reply' : 'comment'}.</h3>
      }
    </form>
    
    
  );
}

export default PostComment;