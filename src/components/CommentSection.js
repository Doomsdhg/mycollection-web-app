import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

function CommentSection() {
    const userData = useSelector(state => state.userData);
    const [commentFormValue, setCommentFormValue] = useState();
    const [comments, setComments] = useState();
    const formChangeHandler = function (e) {
        setCommentFormValue(e.target.value);
        console.log(commentFormValue)
    }

    useEffect(()=>{
        getComments()
    },[])

    const getComments = async function (){
        try {
            console.log(userData)
          const request = await fetch('https://mycollection-server.herokuapp.com/api/getcomments', 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({data: {
                itemId: userData.itemId
              }})
            })
            const response = await request.json();
            console.log(response);
            setComments(response);
        } catch (error) {
          console.log(error);
        }
    }

    const sendComment = async function(){
        try {
            console.log(userData)
          const request = await fetch('https://mycollection-server.herokuapp.com/api/createcomment', 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({data: {
                text: commentFormValue,
                userId: userData.userId,
                itemId: userData.itemId
              }})
            })
            const response = await request.json();
            console.log(response);
            setTimeout(()=>{getComments()}, 1000);
        } catch (error) {
          console.log(error);
        }
    }

    return (
    <div className='container'>
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
            <h2>Comments:</h2>
        {comments?
        comments.map((comment, index)=>{
            return (
            <div class="card mt-1" style={{"width": "60vw"}}>
              <div class="card-body">
                <h5 class="card-title" style={{"textDecoration": "underline"}}>{comment.userName}</h5>
                <p class="card-text">{comment.text}</p>
              </div>
            </div>
            )
        })
        :<h3>No comments yet</h3>}
        </div>
    </div>
    
    )
}

export default CommentSection;
