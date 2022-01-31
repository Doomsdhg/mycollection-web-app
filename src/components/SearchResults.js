import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import MDEditor from '@uiw/react-md-editor';
import {useDispatch} from 'react-redux';
import { setSearchQuery } from '../store/reducers';
import {useNavigate} from 'react-router-dom';
import {setItemId, setQuery} from '../store/reducers';
import {useRequestHooks} from '../hooks/serverRequestHooks';
import { ToastContainer, toast } from 'react-toastify';

function SearchResults() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const noImage = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
    const userData = useSelector(state => state.userData);
    const [collectionsArray, setCollectionsArray] = useState();
    const [itemsArray, setItemsArray] = useState();
    const {sendPostRequest} = useRequestHooks();

    useEffect(()=>{
        sendSearchQuery();
    },[window.location.href])

    const itemPageRedirect = async function (e){
      navigate(`/itempage?id=${e.target.parentNode.dataset.id}`)
    }

    const translateSearchQuery = function(query){
      if (query.toLowerCase() === 'книги') {
        return 'Books'
      } else if (query.toLowerCase() === 'алкоголь') {
        return 'Alcohol'
      } else if (query.toLowerCase() === 'другое') {
        return 'Other'
      }
      return query
    }

    const getQuery = function () {
      const indexOfQuery = window.location.href.indexOf('query=') + 6;
      const query = window.location.href.substring(indexOfQuery);
      console.log(indexOfQuery)
      console.log(query)
      dispatch(setSearchQuery(query));
      return query
    }

    const sendSearchQuery = async function(){
        try {
          const query = getQuery();
          const translatedQuery = translateSearchQuery(query);
          const {response, error} = await sendPostRequest('search', 'query', translatedQuery);
          if (error) {
            throw new Error(error)
          }
          setCollectionsArray(response.collections);
          setItemsArray(response.items);
        } catch (e) {
          toast('' + e)
        }
      }

    return (
      <div className='container main-container'>
      <h1>{userData.language==='en'?'Search results':'Результаты поиска'}</h1>
        <div className='d-flex p-2 bd-highlight mt-3 m-auto'>
            
            <div className="d-inline-flex p-2 bd-highlight align-items-start flex-column search-results">
              <h2>{userData.language === 'en'?'Items found by seeking in item info/comments':'Предметы, найденные по ключевым словам в информации о предмете/комментариях'}</h2>
            {itemsArray?
            itemsArray.length !== 0?
            itemsArray.map((item, index)=>{
                return (
                <div className="card mt-2 w-100 text-break" key={index} >
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
                <div className="card mt-2 w-100 text-break" key={index} >
                      <div className="card-body" data-id={item._id}>
                      
                        <h5 className="card-title d-inline-block w-80">{item.name?item.name:userData.language==='en'?'no name':'без имени'}</h5><br/>
                        <p className="card-text d-inline-block"></p><br/>
                        <a className="btn btn-primary" onClick={itemPageRedirect}>{userData.language === 'en'?'Open item':'Просмотр предмета'}</a>
                        
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
