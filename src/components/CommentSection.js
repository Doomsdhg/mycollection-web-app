import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useRequestHooks} from '../hooks/serverRequestHooks';
import { ToastContainer, toast } from 'react-toastify';

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
          const {response, error} = await sendPostRequest('getcomments', 'itemId', userData.itemId);
          if (error) {
            throw new Error(error)
          }
          setComments(response);
        } catch (e) {
          toast('' + e)
        }
    }

    const sendComment = async function(){
        try {
            const commentData = {
              text: commentFormValue,
              userId: userData.userId,
              itemId: userData.itemId
            };
            const {error} = await sendPostRequest('createcomment', 'comment', commentData, userData)
            if (error) {
              throw new Error(error)
            }
            setTimeout(()=>{getComments()}, 1000);
        } catch (e) {
          toast('' + e)
        }
    }

    return (
    <div className='container'>
      <div className='d-block p-2 rounded'>
        <form>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label"><h5>{userData.language==='en'?'Leave a comment':'Оставить комментарий'}</h5></label>
                <textarea class="form-control" id="exampleFormControlTextarea1" onChange={formChangeHandler} rows="3"></textarea>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-primary mb-3" onClick={sendComment}>{userData.language==='en'?'send':'отправить'}</button>
            </div>
        </form>
        <div className='container d-block'>
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
    </div>
    
    )
}

export default CommentSection;
