import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useRequestHooks} from '../hooks/serverRequestHooks';

function CommentSection() {
    const {sendPostRequest} = useRequestHooks();
    const userData = useSelector(state => state.userData);
    const [commentFormValue, setCommentFormValue] = useState();
    const [comments, setComments] = useState([]);
    const formChangeHandler = function (e) {
        setCommentFormValue(e.target.value);
    }

    useEffect(()=>{
      getComments()
      setInterval(()=>{
        getComments()
      }, 3000)
    },[])

    const getComments = async function (){
        try {
          const response = await sendPostRequest('getcomments', 'itemId', userData.itemId);
          setComments(response);
        } catch (error) {
          console.log(error);
        }
    }

    const sendComment = async function(){
        try {
            const commentData = {
              text: commentFormValue,
              userId: userData.userId,
              itemId: userData.itemId
            };
            await sendPostRequest('createcomment', 'comment', commentData, userData)
            setTimeout(()=>{getComments()}, 1000);
        } catch (error) {
          console.log(error);
        }
    }

    return (
    <div className='container main-container'>
        <form>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label"><h5>Leave a comment</h5></label>
                <textarea class="form-control" id="exampleFormControlTextarea1" onChange={formChangeHandler} rows="3"></textarea>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-primary mb-3" onClick={sendComment}>send</button>
            </div>
        </form>
        <div className='container'>
            <h2>{userData.language === 'en'?'Comments:':'Комментарии'}</h2>
        {comments.length !== 0?
        comments.map((comment, index)=>{
            return (
            <div class="card mt-1 mb-3">
              <div class="card-body">
                <h5 class="card-title text-decoration-underline">{comment.userName}</h5>
                <p class="card-text">{comment.text}</p>
              </div>
            </div>
            )
        })
        :<h4 className='mb-5'>{userData.language === 'en'?'No comments yet:':'Комментариев пока нет'}</h4>}
        </div>
    </div>
    
    )
}

export default CommentSection;
