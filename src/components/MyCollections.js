import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function MyCollections() {
  const userData = useSelector(state => state.userData);
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const routeChange = function () {
    navigate('/createcollection')
  }
  const fetchCollections = async function(){
    try {
      const request = await fetch('https://mycollection-app.herokuapp.com/api/fetchcollections', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: {
            email: userData.email
          }})
        });
        const response = await request.json();
        console.log(response);
        setCollections(response);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchCollections()
  },[])
    return (
        <div className='container' style={{'marginTop': '100px'}}>  
              <div className="my-3 p-3 bg-body rounded shadow-sm">
              <h1 style={{'display': 'inline'}}>Your collections</h1>
                <button type="button" className="btn btn-primary" onClick={routeChange}
                style={{'display': 'inline', 'marginLeft': '20px', 'marginTop': '-20px', 'backgroundColor': '#4CAF50', 'border': 'none'}}>
                  + Create new collection</button>

                {collections.map((collection) => {
                  return (
                    <div className="card" style={{"width": "99%", "marginTop":"20px", 'flex-direction': 'row'}}>
                      <img src={collection.imageURL} className="card-img-top" alt="..." style={{'width': '10%',
                      'maxHeight': '100px', 'maxWidth': '100px', 'marginTop': '20px', 'marginLeft': '20px', 
                      }} />
                      <div className="card-body">
                      
                        <h5 className="card-title" style={{'display': 'inline-block', 'width': '80%'}}>{collection.name}</h5><br/>
                        <p className="card-text" style={{'display': 'inline-block'}}>{collection.description}</p><br/>
                        <a href="#" className="btn btn-primary">Open collection</a>
                      </div>
                    </div>
                  )
                })}

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
