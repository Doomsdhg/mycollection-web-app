import React, {useState} from 'react';

function CreateCollection() {
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
    return (
        <div className='container' style={{'marginTop': '100px'}}>  
            <h3 style={{'marginTop': '80px'}}>Enter data of your future collection</h3>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1"></span>
              <input type="text" className="form-control" placeholder="Collection name" aria-describedby="basic-addon1" />
            </div>

            <div className="input-group">
              <span className="input-group-text">Collection description</span>
              <textarea className="form-control" aria-label="With textarea"></textarea>
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
                >Drop files to upload</div>:
                <div className ="drag-n-drop empty"
                onDragStart={e => {dragStartHandler(e)}}
                onDragLeave={e => {dragLeaveHandler(e)}}
                onDragOver={e => {dragStartHandler(e)}}
                >Locate files here</div>
                }
            </div>
        </div>


    )
}

export default CreateCollection
