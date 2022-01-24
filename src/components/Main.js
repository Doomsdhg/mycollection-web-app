import React, {useState, useEffect} from 'react';
import { TagCloud } from 'react-tagcloud';
import {setSearchQuery, setItemId, setCollectionId} from '../store/reducers';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

function Main() {
  const noImage = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentlyAddedItems, setCurrentlyAddedItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [biggestCollections, setBiggestCollections] = useState([]);
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
      const request = await fetch('https://mycollection-server.herokuapp.com/api/getlastitems')
      const response = await request.json();
      console.log(response)
      setCurrentlyAddedItems(response);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchBiggestCollections = async function(){
    try {
      const request = await fetch('https://mycollection-server.herokuapp.com/api/getbiggestcollections')
      const response = await request.json();
      console.log(response)
      setBiggestCollections(response);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchTags = async function(){
    try {
      const request = await fetch('https://mycollection-server.herokuapp.com/api/gettags')
      const response = await request.json();
      console.log(response)
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
      console.log(tagsArray)
      setTags(tagsArray);
    } catch (error) {
      console.log(error);
    }
  }

  const goToItemPage = function (e){
    dispatch(setItemId(e.target.dataset.id));
    navigate('/itempage')
  }

  const searchByTag = async function(query){
    dispatch(setSearchQuery(query));
    navigate('/search')
  }

  const redirectToCollection = function(e){
    dispatch(setCollectionId(e.target.dataset.id));
    navigate('/collectionpage')
  }

  const renderTag = function(tag, size, color){
    return (
      <span key={tag.value} style={{ color }} className={'tag-' + size}>{tag.value} </span>
    )
  }

    return (
        <main className="container" style={{marginTop: '80px'}}>
          <div className="d-flex align-items-center p-3 my-3 text-white bg-purple rounded shadow-sm">
            <div className="lh-1">
              <h1 className="display-1" style={{color: 'black'}}>Feed</h1>
              <small style={{color: 'black'}}>Latest updates on MyCollection</small>
            </div>
          </div>

          <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-0">Currently added items</h6>
            {currentlyAddedItems.map((item)=>{
              return (
              <div className="text-muted pt-3">
              

              <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">{item.name?item.name:'no name'}
                <button style={{'float': 'right'}} type="button" className="btn btn-primary" data-id={item._id} onClick={(e)=>{goToItemPage(e)}}>
                Open</button>
                </strong>
                {item.tags?item.tags:'no tags'}
                
              </p>
              
            </div>)
            })}
            
            
          </div>

          <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-0">Collections with biggest amounts of items</h6>
            
            
              {
                biggestCollections.map((collection)=>{
                  return(
                    <div className="d-flex pb-3 mb-0 small lh-sm border-bottom w-100">
                      <img src={collection.imageURL?collection.imageURL:noImage} 
                      style={{'display':'inline-block','width': '10%',
                      'height': '10%', 'maxHeight': '100px', 'maxWidth': '100px', 'marginTop':'20px', 'marginLeft':'20px' }} />
                      <div style={{'display':'inline-block','marginTop':'20px', 'marginLeft':'20px'}}>
                        <span className="text-gray-dark" >Collection name: <b>{collection.name}</b></span><br/>
                        
                        <span>Collection description: <i>{collection.description}</i></span><br/>
                        <span>Topic: <b>{collection.topic}</b></span><br/>
                        <span>Amount of items: <b>{collection.items.length}</b></span><br/>
                        <button className='btn btn-primary' style={{'display': 'inline-block', 'float':'left'}} data-id={collection._id} 
                        onClick={e=>redirectToCollection(e)}>Open</button>
                      </div>
                    </div>
                  )
                })
              }
            </div>

          <div className="align-items-center p-3 my-3 text-white bg-purple rounded shadow-sm">
            <div className="lh-1" id="tag-cloud-header" style={{'marginTop':'0px','textAlign':'center','display': 'block', 'borderBottom':'1px solid #bdc3c7'}}>
              <h3 style={{color: 'black'}}>Tag cloud</h3>
            </div>
            
          

          <p style={{'display': 'block', 'textAlign' : 'center', 'marginTop':'70px'}}>
            <p className='p-5' 
            style={{'boxShadow':'0 .5rem 1rem #b8ddff','display':'inline-block','border': '1px solid #bdc3c7', 'borderRadius':'40%'}}>
            <TagCloud
            minSize={12}
            maxSize={35}
            tags={tags ? tags : defaultTags}
            onClick={tag => searchByTag(tag.value)} 
            />
            </p>
          </p>
          </div>
        </main>
    )
}

export default Main
