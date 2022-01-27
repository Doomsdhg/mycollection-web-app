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

      const itemPageRedirect = async function (e){
        console.log(e.target.parentNode.dataset.id);
        dispatch(setItemId(e.target.parentNode.dataset.id));
        navigate('/itempage')
        
      }

    return (
      <div className='container main-container'>
      <h1>Search results</h1>
        <div className='d-flex p-2 bd-highlight mt-3 m-auto'>
            
            <div className="d-inline-flex p-2 bd-highlight align-items-start flex-column search-results">
              <h2>{userData.language === 'en'?'Items found by seeking in item info/comments':'Предметы найденные по ключевым словам в инфмормации о предмете/комментариях'}</h2>
            {itemsArray?
            itemsArray.length !== 0?
            itemsArray.map((item, index)=>{
                return (
                <div className="card mt-2 w-80 text-break" key={index} >
                      <div className="card-body" data-id={item._id}>
                      
                        <h5 className="card-title d-inline-block w-80">{item.name?item.name:userData.language === 'en'?'no name':'без имени'}</h5><br/>
                        <p className="card-text d-inline-block">{item.tags}</p><br/>
                        <a className="btn btn-primary" onClick={itemPageRedirect}>{userData.language === 'en'?'Open item':'Просмотр предмета'}</a>
                        
                      </div>
                    </div>)
            })
            : <div className='w-100 text-center mt-5'><h1>{userData.language === 'en'?'No results':'Нет результатов'}</h1></div>
            : null
            }
            </div>
            
            <div className="d-inline-flex p-2 bd-highlight align-items-start flex-column search-results">
            <h2>{userData.language === 'en'?'Items found by seeking in collection info':'Предметы, найденные по содержанию ключевых слов в информации коллекции'}</h2>
            {collectionsArray?
            collectionsArray.length !== 0?
            collectionsArray.map((item, index)=>{
              if (!item) return null
                return (
                <div className="card mt-2 w-80 text-break" key={index} >
                      <div className="card-body" data-id={item._id}>
                      
                        <h5 className="card-title d-inline-block w-80">{item.name}</h5><br/>
                        <p className="card-text d-inline-block">
                        <MDEditor.Markdown 
                          source={item.description} 
                        /></p><br/>
                        <a className="btn btn-primary" onClick={itemPageRedirect}>{userData.language === 'en'?'Open item':'Просмотр'}</a>
                        
                      </div>
                    </div>)
            })
            : <div className='w-100 mt-5 text-center'><h1>{userData.language === 'en'?'No results':'Нет результатов'}</h1></div>
            : null
            }
            </div>
        </div>
        </div>
    )
}

export default SearchResults
