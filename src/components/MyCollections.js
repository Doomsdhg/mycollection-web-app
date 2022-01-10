import React from 'react';
import {useNavigate} from 'react-router-dom';

export default function MyCollections() {
  const navigate = useNavigate();
  const routeChange = function () {
    navigate('/createcollection')
  }
    return (
        <div className='container' style={{'marginTop': '100px'}}>  
              <div className="my-3 p-3 bg-body rounded shadow-sm">
              <h1 style={{'display': 'inline'}}>Your collections</h1>
                <button type="button" className="btn btn-primary" onClick={routeChange}
                style={{'display': 'inline', 'marginLeft': '20px', 'marginTop': '-20px', 'backgroundColor': '#4CAF50', 'border': 'none'}}>
                  + Create new collection</button>

                <div className="card" style={{"width": "99%", "marginTop":"20px"}}>
                  <img src="..." className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                  </div>
                </div>
                <div className="card" style={{"width": "99%","marginTop": "20px"}}>
                  <img src="..." className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                  </div>
                </div>
                <div className="card" style={{"width": "99%","marginTop": "20px"}}>
                  <img src="..." className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                  </div>
                </div>
                
                
              </div>

            
          </div>
    )
}
