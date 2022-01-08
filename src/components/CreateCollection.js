import React, {useState} from 'react';

function CreateCollection() {
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
        let files = [...e.dataTransfer.files];
        const formData = new FormData();
        formData.append('file', files[0]);
        const request = await fetch('https://mycollection-server.herokuapp.com/api/pictureupload', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData
        });
        const response = await request.json();
        console.log(response);
        setDrag(false);
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

    return (
        <div className='container' style={{'marginTop': '100px'}}>  
            <h3>Enter data for your future collection</h3>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Collection name</span>
              <input type="text" className="form-control" placeholder="My collection" aria-describedby="basic-addon1" />
            </div>

            <div className="input-group">
              <span className="input-group-text">Collection description</span>
              <textarea className="form-control" aria-label="With textarea" placeholder="Text..."></textarea>
            </div>

            <div className="input-group mb-3 mt-3">
              <label className="input-group-text" htmlFor="inputGroupSelect01">Topic</label>
              <select className="form-select" id="inputGroupSelect01">
                <option defaultValue={true}>Choose...</option>
                <option value="1">Books</option>
                <option value="2">Alcohol</option>
                <option value="3">Other</option>
              </select>
            </div>

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
            </div>
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
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Item name</span>
              <input type="text" disabled={true} className="form-control" placeholder="My collection" aria-describedby="basic-addon1" />
            </div>

            <div className="input-group">
              <span className="input-group-text">Item description</span>
              <textarea className="form-control"  disabled={true} aria-label="With textarea" placeholder="Text..."></textarea>
            </div>

            <div className="input-group mt-3">
              <span className="input-group-text">Tags</span>
              <textarea className="form-control"  disabled={true} aria-label="With textarea" placeholder="Text..."></textarea>
            </div>
            {itemFields.map((item, index) => (
              <div className="input-group mt-3" key={index}>
              <span className="input-group-text">{item} field</span>
              <textarea className="form-control" aria-label="With textarea" placeholder="Type field name here">
              </textarea>
              </div>
            ))}
        </div>
    )
}

export default CreateCollection
