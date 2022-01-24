import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import MDEditor from '@uiw/react-md-editor';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {setItemId} from '../store/reducers';

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
          console.log(userData.query);
            console.log('trying')
          const request = await fetch('http://localhost:8080/api/search', 
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

      const itemPageRedirect = async function (e){
        console.log(e.target.parentNode.dataset.id);
        dispatch(setItemId(e.target.parentNode.dataset.id));
        navigate('/itempage')
        
      }

    return (
      <div className='container' style={{'marginTop': '100px'}}>
      <h1>Search results</h1>
        <div className='d-flex p-2 bd-highlight' style={{'marginTop': '100px', 'margin':'0 auto'}}>
            
            <div className="d-inline-flex p-2 bd-highlight" style={{'flex': '1', 'flexDirection': 'column', 'alignItems': 'left'}}>
              <h2>Items found by seeking in item info</h2>
            {itemsArray?
            itemsArray.length !== 0?
            itemsArray.map((item, index)=>{
                return (
                <div className="card" key={index} 
                    style={{"marginTop":"20px", 'width': '80%', 'word-break': 'break-word'}}>
                      <div className="card-body" data-id={item._id}>
                      
                        <h5 className="card-title" style={{'display': 'inline-block', 'width': '80%'}}>{item.name?item.name:'no name'}</h5><br/>
                        <p className="card-text" style={{'display': 'inline-block'}}>
                        <MDEditor.Markdown 
                          source={item.description} 
                        /></p><br/>
                        <a className="btn btn-primary" onClick={itemPageRedirect}>Open item</a>
                        
                      </div>
                    </div>)
            })
            : <div style={{
                'marginTop': '70px',
                'textAlign': 'center'}}><h1>No results</h1></div>
            : null
            }
            </div>
            
            <div className="d-inline-flex p-2 bd-highlight" style={{'flex': '1', 'flexDirection': 'column', 'alignItems': 'left'}}>
            <h2>Items found by seeking in collection info</h2>
            {collectionsArray?
            collectionsArray.length !== 0?
            collectionsArray.map((item, index)=>{
              if (!item) return null
                return (
                <div className="card" key={index} 
                    style={{"marginTop":"20px", 'width': '80%', 'word-break': 'break-word'}}>
                      <div className="card-body" data-id={item._id}>
                      
                        <h5 className="card-title" style={{'display': 'inline-block', 'width': '80%'}}>{item.name}</h5><br/>
                        <p className="card-text" style={{'display': 'inline-block'}}>
                        <MDEditor.Markdown 
                          source={item.description} 
                        /></p><br/>
                        <a className="btn btn-primary" onClick={itemPageRedirect}>Open item</a>
                        
                      </div>
                    </div>)
            })
            : <div style={{
                'marginTop': '70px',
                'textAlign': 'center'}}><h1>No results</h1></div>
            : null
            }
            </div>
        </div>
        </div>
    )
}

export default SearchResults
