import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {setCollectionId, setProfileId} from '../store/reducers';
import MDEditor from '@uiw/react-md-editor';


export default function MyCollections() {
  const [owner, setOwner] = useState();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const navigate = useNavigate();
  const noImage = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
  const [collections, setCollections] = useState([]);
  const routeChange = function () {
    navigate('/createcollection')
  }
  const fetchCollections = async function(){
    try {
      const request = await fetch('https://mycollection-server.herokuapp.com/api/fetchcollections', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: {
            userId: userData.profileId
          }})
        });
        const response = await request.json();
        console.log(response);
        setCollections(response.collections);
        setOwner(response.owner);
        
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchCollections()
  },[])
  const collectionPageRedirect = async function (e){
    console.log(e.target.parentNode.dataset.id);
    dispatch(setCollectionId(e.target.parentNode.dataset.id));
    navigate('/collectionpage')
    
  }
    return (
        <div className='container' style={{'marginTop': '100px'}}>  
              <div className="my-3 p-3 bg-body rounded shadow-sm">
              <h1 style={{'display': 'inline'}}>{owner && userData.profileId !== userData.userId ? userData.language === 'en' ? owner.name + "'s collections" : 'Коллекции' + owner.name: userData.language === 'en' ? 'Your collections' : 'Ваши коллекции'} </h1>
                <button type="button" className="btn btn-primary" onClick={routeChange}
                style={{'display': 'inline', 'marginLeft': '20px', 'marginTop': '-20px', 'backgroundColor': '#4CAF50', 'border': 'none'}}>
                  + {userData.language === 'en'?'Create new collection':'Создать новую коллекцию'}</button>

                {collections.map((collection, index) => {
                  return (
                    <div className="card" key={index} 
                    style={{"width": "99%", "marginTop":"20px", 'flexDirection': 'row', 'word-break': 'break-word'}}>
                      <img src={collection.imageURL?collection.imageURL:noImage} className="card-img-top" alt="..." 
                      style={{'width': '10%',
                      'height': '10%', 'maxHeight': '100px', 'maxWidth': '100px', 'marginTop': '20px', 'marginLeft': '20px' }} />
                      <div className="card-body" data-id={collection._id}>
                      
                        <h5 className="card-title" style={{'display': 'inline-block', 'width': '80%'}}>{collection.name}</h5><br/>
                        <p className="card-text" style={{'display': 'inline-block'}}>
                        <MDEditor.Markdown 
                          source={collection.description} 
                        /></p><br/>
                        <a className="btn btn-primary" onClick={collectionPageRedirect}>{userData.language === 'en'?'Open collection':'Просмотреть коллекцию'}</a>
                        
                      </div>
                    </div>
                  )
                
                })}
                
                <ToastContainer />
              </div>

            
          </div>
    )
}
