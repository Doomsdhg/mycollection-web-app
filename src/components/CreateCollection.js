import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

function CreateCollection() {
    const dispatch = useDispatch();
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

    const changeHandler = async function(e){
      console.log(e.target);
      setFormValue({...formValue, [e.target.name]: e.target.value});
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

    const submitHandler = function (e) {
      if (!preview) {
        uploadCollection()
      } else {
        uploadImage(preview)
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
          uploadCollection(response.url);
        } catch (error) {
          console.error(error)
        }
    }

    const uploadCollection = async function(imageURL){
      setFormValue({...formValue, creator: userData.email})
      if (imageURL) {
      setFormValue({...formValue, imageURL});
      } 
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/uploadcollection', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: formValue})
        });
        const response = await request.json();
        console.log(response.message);
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

            <div className="">
              <span className="-text">Collection description</span>
              <textarea className="form-control" name='description' aria-label="With textarea" onChange={changeHandler} placeholder="Text..."></textarea>
            </div>

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
                <button type="button" className="btn btn-outline-success" name="number" id="1337" onClick={e => addField(e)}>Add numeric field</button>
                <button type="button" className="btn btn-outline-success" name="string" onClick={e => addField(e)}>Add string field</button>
                <button type="button" className="btn btn-outline-success" name="text" onClick={e => addField(e)}>Add text field</button>
                <button type="button" className="btn btn-outline-success" name="date" onClick={e => addField(e)}>Add date field</button>
                <button type="button" className="btn btn-outline-success" name="checkbox" onClick={e => addField(e)}>Add checkbox</button>
              </div>
            </div>
              <p>Each item in this collection will include following fields:</p>
            <div className="mb-3">
              <span className="-text" id="basic-addon1">Item name</span>
              <input type="text" disabled={true} className="form-control" placeholder="My collection" aria-describedby="basic-addon1" />
            </div>

            <div className="">
              <span className="-text">Item description</span>
              <textarea className="form-control"  disabled={true} aria-label="With textarea" placeholder="Text..."></textarea>
            </div>

            <div className="mt-3">
              <span className="-text">Tags</span>
              <textarea className="form-control"  disabled={true} aria-label="With textarea" placeholder="Text..."></textarea>
            </div>
            {itemFields.map((item, index) => (
              <div className="mt-3" key={index}>
              <span className="-text">{item} field</span>
              <textarea className="form-control" name={item + "Field" + getIndex(item, index)} aria-label="With textarea" onChange={changeHandler} placeholder="Type field name here">
              </textarea>
              </div>
            ))}
            <button type="button" className="btn btn-success mt-3 mb-3" onClick={submitHandler}>Create</button>
        </div>
    )
}

export default CreateCollection
