import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import MDEditor from '@uiw/react-md-editor';
import {setImageURL} from '../store/reducers'

function CreateCollection() {
    const dispatch = useDispatch();
    const [markdownValue, setMarkdownValue] = useState();
    const navigate = useNavigate();
    const userData = useSelector(state => state.userData);
    const [formValue, setFormValue] = useState({});
    const [preview, setPreview] = useState();
    const [error, setError] = useState();
    const [itemFields, setItemFields] = useState([]);
    const [drag, setDrag] = useState(false);
    const dragStartHandler = function (e) {
        e.preventDefault();
        setDrag(true);
    }
    const dragLeaveHandler = function (e) {
        e.preventDefault();
        setDrag(false);
    }
    const dropHandler = async function (e) {
      e.preventDefault();
        let files = [...e.dataTransfer.files];
        const formData = new FormData();
        formData.append('file', files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onloadend = ()=>{
          setPreview(reader.result);
          console.log(reader.result)
        }
        
        setDrag(false);
    }

    useEffect(()=>{
      setFormValue({...formValue, description: markdownValue});
      console.log(markdownValue);
    },[markdownValue])

    useEffect(()=>{
      setFormValue({creator: userData.userId});
    },[]);


    const changeHandler = function(e){
      setFormValue({...formValue, [e.target.name]: e.target.value});
      console.log(formValue)
    }

    const addField = function(e){
      try {
        let fieldType = e.target.name;
        let fieldTypeAmount = itemFields.filter(item => item === fieldType) 
        if (fieldTypeAmount.length >= 3) {
          throw new Error('You can not add more than 3 fields of each type')
        }
        
        setItemFields(itemFields.concat([fieldType]));
        console.log(itemFields);
        setError('');
      } catch (e) {
        setError(e);
        console.log(e)
      }
    }

    const submitHandler = async function (e) {
      
      if (!preview) {
        uploadCollection()
      } else {
        await uploadImage(preview);
        setTimeout(()=>{uploadCollection()})
      }
    }

    const uploadImage = async function(image){
        try {
          const request = await fetch('https://mycollection-server.herokuapp.com/api/uploadimage', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: image})
          });
          const response = await request.json();
          console.log(response);
          console.log(userData.email);
          const imageURL = response.url;
          dispatch(setImageURL(imageURL))
          
          
          console.log(formValue)
          
            
          
        } catch (error) {
          console.error(error)
        }
    }

    const uploadCollection = async function(){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/uploadcollection', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: {...formValue, imageURL: userData.imageURL}})
        });
        const response = await request.json();
        console.log(response.message);
        dispatch(setImageURL(''))
        navigate('/mycollections');
        setTimeout(()=>{
          toast('Collection created successfully!');
        },100)

      } catch (error) {
        console.error(error)
      }
    }

    const getIndex = function(formName, formIndex){
      const fieldsArr = [...itemFields];
      fieldsArr.sort();
      if (formIndex === fieldsArr.indexOf(formName)) {
        return 1
      } else if (formIndex === fieldsArr.lastIndexOf(formName)) {
        return 3
      } else {
        return 2
      }
    }

    

    return (
        <div className='container' style={{'marginTop': '100px'}}>  
            <h3>Enter data for your future collection</h3>
            <div className="mb-3">
              <span className="text" id="basic-addon1">Collection name</span>
              <input type="text" className="form-control" name='name' placeholder="My collection" onChange={changeHandler} aria-describedby="basic-addon1" />
            </div>

            <MDEditor
                value={markdownValue}
                onChange={setMarkdownValue}
                name='description'
              />

            <div className="mb-3 mt-3">
              <label className="-text" htmlFor="inputGroupSelect01">Topic</label>
              <select className="form-select" name='topic' id="inputGroupSelect01" onChange={changeHandler}>
                <option defaultValue={true}>Choose...</option>
                <option value="Books">Books</option>
                <option value="Alcohol">Alcohol</option>
                <option value="Other">Other</option>
              </select>
            </div>

            
              {preview?
              <img src={preview} alt='' style={{'height':'100px'}}/>:
              <div className="drag-n-drop-area">
                {drag?
                <div className ="drag-n-drop hovered"
                onDragStart={e => {dragStartHandler(e)}}
                onDragLeave={e => {dragLeaveHandler(e)}}
                onDragOver={e => {dragStartHandler(e)}}
                onDrop={e => {dropHandler(e)}}
                >Collection image (optional). Drop files to upload</div>:
                <div className ="drag-n-drop empty"
                onDragStart={e => {dragStartHandler(e)}}
                onDragLeave={e => {dragLeaveHandler(e)}}
                onDragOver={e => {dragStartHandler(e)}}
                >Collection image (optional). Drag files here</div>
                }
              </div>}
            
            <div className='wrapper' style={{'marginTop': '20px'}}>
              <h3>Fields for each collection item</h3>
              <p>(You can add up to 3 fields of each type)</p>
              {(()=>{
                if (error) {
                  return <p style={{'color':'red'}}>{error.message}</p>
                }
              })()}
              <div className="btn-group" role="group" aria-label="Basic outlined example">
                <button type="button" className="btn btn-outline-success" name="number" onClick={e => addField(e)}>Add numeric field</button>
                <button type="button" className="btn btn-outline-success" name="string" onClick={e => addField(e)}>Add string field</button>
                <button type="button" className="btn btn-outline-success" name="text" onClick={e => addField(e)}>Add text field</button>
                <button type="button" className="btn btn-outline-success" name="date" onClick={e => addField(e)}>Add date field</button>
                <button type="button" className="btn btn-outline-success" name="checkbox" onClick={e => addField(e)}>Add checkbox</button>
              </div>
            </div>
              <p>Each item in this collection will include following fields:</p>
            <div className="mb-3">
              <span className="-text" id="basic-addon1">Item id</span>
              <input type="text" disabled={true} className="form-control" placeholder="My collection" aria-describedby="basic-addon1" />
            </div>

            <div className="">
              <span className="-text">Item name</span>
              <textarea className="form-control"  disabled={true} aria-label="With textarea" placeholder="Text..."></textarea>
            </div>

            <div className="mt-3">
              <span className="-text">Tags</span>
              <textarea className="form-control"  disabled={true} aria-label="With textarea" placeholder="Text..."></textarea>
            </div>
            {itemFields.sort().map((item, index) => (
              <div className="mt-3" key={index}>
              <span className="-text">{item} field</span>
              <textarea className="form-control" name={item + "Field" + getIndex(item, index)} aria-label="With textarea" onChange={changeHandler} placeholder="Type field name here">
              </textarea>
              </div>
            ))}
            <button type="button" className="btn btn-success mt-3 mb-3" onClick={submitHandler}>Create</button>
            <ToastContainer />
        </div>
    )
}

export default CreateCollection
