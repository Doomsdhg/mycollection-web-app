import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import MDEditor from '@uiw/react-md-editor';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {setCollectionId} from '../store/reducers';

function SearchResults() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const noImage = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
    const userData = useSelector(state => state.userData);
    const [collectionsArray, setCollectionsArray] = useState();
    const [itemsArray, setItemsArray] = useState();
    useEffect(()=>{
        sendSearchQuery();
    },[])

    const sendSearchQuery = async function(){
        try {
            console.log('trying')
          const request = await fetch('https://mycollection-server.herokuapp.com/api/search', 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({data: {
                query: userData.query
              }})
            })
            const response = await request.json();
            console.log(response);
            setCollectionsArray(response.collections);
            setItemsArray(response.items);
        } catch (error) {
          console.log(error);
        }
      }

      const collectionPageRedirect = async function (e){
        console.log(e.target.parentNode.dataset.id);
        dispatch(setCollectionId(e.target.parentNode.dataset.id));
        navigate('/collectionpage')
        
      }

    return (
        <div className='container' style={{'marginTop': '100px'}}>
            <div className="my-3 p-3 bg-body rounded shadow-sm">
              <h1 style={{'display': 'inline'}}>Search results</h1>
            {collectionsArray && itemsArray?
            collectionsArray.length !== 0 || itemsArray.length !== 0?
            collectionsArray.map((collection, index)=>{
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
                        <a className="btn btn-primary" onClick={collectionPageRedirect}>Open collection</a>
                        
                      </div>
                    </div>)
            })
            : <div style={{
                'position': 'absolute',
                'marginTop': '70px',
                'textAlign': 'center',
                'width': '85vw'}}><h1>No results</h1></div>
            : null
            }
            </div>
        </div>
    )
}

export default SearchResults
