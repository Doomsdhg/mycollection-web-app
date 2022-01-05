import React from 'react'

export default function MyCollections() {
    return (
        <div className='container' style={{'marginTop': '100px'}}>
            
            <h1 style={{'display': 'inline'}}>Your collections</h1>
            <button type="button" class="btn btn-primary" style={{'display': 'inline', 'marginLeft': '20px', 'marginTop': '-20px'}}>Create new collection</button>
            
            <div className="card" style={{"width": "80rem", "marginTop":"20px"}}>
              <img src="..." className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
            <div className="card" style={{"width": "80rem","marginTop": "20px"}}>
              <img src="..." className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
            <div className="card" style={{"width": "80rem","marginTop": "20px"}}>
              <img src="..." className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
            </div>
        </div>
    )
}
