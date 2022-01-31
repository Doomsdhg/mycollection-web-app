import React, {useState, useEffect} from 'react';
import { TagCloud } from 'react-tagcloud';
import {setSearchQuery, setItemId, setCollectionId} from '../store/reducers';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import {useRequestHooks} from '../hooks/serverRequestHooks';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from 'styled-components';

function Main() {
  const theme = useTheme();
  const noImage = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentlyAddedItems, setCurrentlyAddedItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [biggestCollections, setBiggestCollections] = useState([]);
  const userData = useSelector(state=>state.userData);
  const {sendGetRequest} = useRequestHooks();
  const defaultTags = [
    { value: 'JavaScript', count: 38 },
    { value: 'React', count: 30 },
    { value: 'Nodejs', count: 28 },
    { value: 'Express.js', count: 25 },
    { value: 'HTML5', count: 33 },
    { value: 'MongoDB', count: 18 },
    { value: 'CSS3', count: 20 },
  ];

  useEffect(()=>{
    fetchTags();
    fetchLastItems();
    fetchBiggestCollections()
  },[])

  const fetchLastItems = async function(){
    try {
      const {response, error} = await sendGetRequest('getlastitems');
      if (error) {
        throw new Error(error)
      }
      setCurrentlyAddedItems(response);
    } catch (e) {
      toast('' + e)
    }
  }

  const fetchBiggestCollections = async function(){
    try {
      const {response, error} = await sendGetRequest('getbiggestcollections');
      if (error) {
        throw new Error(error)
      }
      setBiggestCollections(response);
    } catch (e) {
      toast('' + e)
    }
  }

  const fetchTags = async function(){
    try {
      const {response, error} = await sendGetRequest('gettags');
      if (error) {
        throw new Error(error)
      }
      const keys = Object.keys(response);
      let tagsArray = Object.values(response);
      tagsArray = tagsArray.map((tag, index)=>{
        return (
          {
            value: keys[index],
            count: tag
          }
        )
      })
      setTags(tagsArray);
    } catch (e) {
      toast('' + e)
    }
  }

  const goToItemPage = function (e){
    navigate(`/itempage?id=${e.target.dataset.id}`)
  }

  const searchByTag = async function(query){
    navigate(`/search?query=${query}`)
  }

  const redirectToCollection = function(e){
    navigate(`/collectionpage?id=${e.target.dataset.id}`)
  }

    return (
        <main className={'container main-container rounded'}>
          <div className="d-flex align-items-center p-3 my-3 bg-purple rounded shadow-sm">
            <div className="lh-1">
              <h1 className="display-1">{userData.language === 'en'?'Feed':'Лента событий'}</h1>
              <small>{userData.language === 'en'?'Latest updates':'Последние обновления'}</small>
            </div>
          </div>

          <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-0">{userData.language === 'en'?'Currently added items':'Последние добавленные предметы'}</h6>
            {currentlyAddedItems.map((item)=>{
              return (
              <div className="text-muted pt-3">
              

              <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">{item.name?item.name:userData.language==='en'?'no name':'без имени'}
                <button type="button" className="btn btn-primary float-end" data-id={item._id} onClick={(e)=>{goToItemPage(e)}}>
                {userData.language === 'en'?'Open':'Открыть'}</button>
                </strong>
                {item.tags?item.tags:userData.language === 'en'?'No tags':'Без тэгов'}
                
              </p>
              
            </div>)
            })}
            
            
          </div>

          <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-0">{userData.language === 'en'?'Collections with biggest amount of items':'Коллекции с наибольшим количеством предметов'}</h6>
            
            
              {
                biggestCollections.map((collection)=>{
                  return(
                    <div className="d-flex pb-3 mb-0 small lh-sm border-bottom w-100">
                      <img className='d-inline-block mt-4 ms-4' src={collection.imageURL?collection.imageURL:noImage} />
                      <div className='d-inline-block mt-3 ms-3'>
                        <span className="text-gray-dark" >{userData.language === 'en'?'Collection name: ':'Название коллекции: '}<b>{collection.name}</b></span><br/>
                        
                        <span>{userData.language === 'en'?'Collection description: ':'Описание коллекции'}
                        <MDEditor.Markdown 
                          source={collection.description} /></span><br/>
                        <span>{userData.language === 'en'?'Topic: ':'Категория: '}<b>{collection.topic}</b></span><br/>
                        <span>{userData.language === 'en'?'Amount of items: ':'Количество предметов: '}<b>{collection.items.length}</b></span><br/>
                        <button className='btn btn-primary d-inline-block float-start' data-id={collection._id} 
                        onClick={e=>redirectToCollection(e)}>{userData.language === 'en'?'Open':'Открыть'}</button>
                      </div>
                    </div>
                  )
                })
              }
            </div>

          <div className="d-block align-items-center p-3 my-3 text-white bg-purple rounded shadow-sm">
            <div className="lh-1 text-center" id="tag-cloud-header " >
              <h3>{userData.language === 'en'?'Tag cloud':'Облако тегов'}</h3>
            </div>
            
          

          <p className='d-block mt-5 text-center'>
            <p className='shadow-lg p-3 mb-5 bg-body rounded-pill d-inline-block p-5'>
            <TagCloud
            minSize={12}
            maxSize={35}
            tags={tags ? tags : defaultTags}
            onClick={tag => searchByTag(tag.value)} 
            />
            </p>
          </p>
          </div>
          <ToastContainer />
        </main>
    )
}

export default Main
