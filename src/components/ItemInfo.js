import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import MDEditor from '@uiw/react-md-editor';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setCollectionId} from '../store/reducers';
import {useRequestHooks} from '../hooks/serverRequestHooks';
import TextInput from 'react-autocomplete-input';

function ItemInfo() {
    const redHeart = 'https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/50/000000/external-heart-miscellaneous-kiranshastry-lineal-color-kiranshastry.png';
    const whiteHeart = 'data:image/png;base64,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';
    const [markdownValue, setMarkdownValue] = useState();
    const [liked, setLiked] = useState(false);
    const [likesAmount, setLikesAmount] = useState();
    const [itemFormValue, setItemFormValue] = useState({});
    const [displayButtons, setDisplayButtons] = useState(false);
    const [displayForms, setDisplayForms] = useState(false);
    const [itemData, setItemData] = useState();
    const [headersArray, setHeadersArray] = useState([]);
    const [tags, setTags] = useState();
    const [error, setError] = useState('');
    const userData = useSelector(store => store.userData);
    const [fieldsArray, setFieldsArray] = useState([]);
    const {sendPostRequest, sendGetRequest} = useRequestHooks();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
      getHeaders();
      getLikes();
      fetchTags();
    },[])

    useEffect(()=>{
      if (headersArray.length > 0) {
        getItem()
      }
    },[headersArray])

    const toggleItemForms = function(){
      setDisplayForms(prev=>!prev)
    }

    const rate = function (){
      setLiked((prev)=>{return !prev});
      uploadReaction();
    }

    const formChangeHandler = function(e, fieldValue){
      if (!e.target) {
        setItemFormValue(prev=>{return{...prev, tags: e}})
        return null
      } else if (e.target.name.includes('checkbox')) {
        console.log(e.target.checked)
        setItemFormValue(prev=>{return{...prev, [e.target.name]: String(e.target.checked)}});
      } else {
        setItemFormValue(prev=>{return{...itemFormValue, [e.target.name]: String(e.target.value)}});
      }
    }

    const markdownChangeHandler = function(e, formName){
      if (itemFormValue.formName) {
        const newValue = itemFormValue.formName + e;
        setItemFormValue ({...itemFormValue, [formName]: newValue})
      } else {
        setItemFormValue ({...itemFormValue, [formName]: e})
      }
    }

    const getLikes = async function (){
      try {
        const requiredData = {
          itemId: userData.itemId,
          userId: userData.userId
        };
        const {response, error} = await sendPostRequest('getlikes', 'requiredData', requiredData)
        if (error) {
          throw new Error(error)
        }
        setLiked(response.liked);
        setLikesAmount(response.likesAmount);
      } catch (e) {
        toast('' + e)
      }
    }

    const uploadReaction = async function (){
      try {
        const reaction = {
          itemId: userData.itemId,
          userId: userData.userId,
          reaction: liked
        }
        const {error} = await sendPostRequest('uploadreaction', 'reaction', reaction);
        if (error) {
          throw new Error(error)
        }
        getLikes()
      } catch (e) {
        toast('' + e)
      }
    }

    const getItem = async function(){
        try {
          const {fields, response, error} = await sendPostRequest('getitem', 'itemId', userData.itemId, userData, headersArray)
          if (error) {
            throw new Error(error)
          }
          if (response.creator === userData.userId || userData.admin) {
            setDisplayButtons(true);
          }
          setItemData(response);
          dispatch(setCollectionId(response.collectionRef));
          setFieldsArray(fields);
        } catch (e) {
          toast('' + e)
        }
    }

    const getHeaders = async function () {
        try {
          let {headers, error} = await sendPostRequest('getcollectiontable', 'collectionId', userData.collectionId, userData, headersArray)
          if (error) {
            throw new Error(error)
          }
          headers.shift();
          setHeadersArray(prev=>{return[...headers]});
        } catch (e) {
          toast('' + e)
        }
    }

    const deleteItem = async function(e){
      try {
        const itemsToDelete = [e.target.dataset.id];
        const {error} = await sendPostRequest('deleteitems', 'itemsToDelete', itemsToDelete)
        if (error) {
          throw new Error(error)
        }
        setTimeout(()=>{
          toast(userData.language === 'en'?'item deleted successfully!':'Предмет удалён');
        },100)
        navigate('/mycollections');
      } catch (e) {
        toast('' + e)
      }
    }

    const updateItem = async function(){
      try {
        const updateData = {
              update: itemFormValue,
              itemId: userData.itemId
            };
        const {error} = await sendPostRequest('updateitem', 'updateData', updateData)
        if (error) {
          throw new Error(error)
        }
        setTimeout(()=>{
          toast(userData.language === 'en'?'Item info updated successfully!':'Информация обновлена');
        },100)
        getItem()
      } catch (e) {
        toast('' + e)
      }
    }

    const fetchTags = async function(){
      try {
        const {tagsArray, error} = await sendGetRequest('gettags')
        if (error) {
          throw new Error(error)
        }
        setTags([...tagsArray.map(tag => tag.substring(1))]);
      } catch (e) {
        toast('' + e)
      }
    }

    return (
        <div className='container main-container'>
           {(itemData && userData.userId === itemData.creator) || userData.admin ?
            <div>
              <button type="button" className="btn btn-primary mb-3" onClick={toggleItemForms}>{!displayForms?userData.language === 'en'?'Edit item info':'Редактировать информацию о предмете':userData.language === 'en'?'Close editing console':'Закрыть консоль редактирования'}</button>
              <button type="button" className="btn btn-danger ms-3 mb-3" 
              data-id={userData.itemId} onClick={deleteItem}>{userData.language === 'en'?'Delete item':'Удалить предмет'}</button>
              <div>
              <div className={displayForms?"form-group":'display-none'}>
              <h1 className="border-bottom pb-2 mb-0">{userData.language === 'en'?'Item info':'Информация о предмете'}</h1>
              {fieldsArray.map((field, index) => {
                console.log(field)
                const type = field.type.substring(0, field.type.length - 6);
                if (type === 'text') {
                  
                  return (

                    <div className="mb-3 mt-3" key={'text' + index}>
                    <span className="text" id="basic-addon1">{field.name}</span>
                    <MDEditor
                        value={itemFormValue[field.type]?itemFormValue[field.type]:field.value}
                        name={field.type}
                        onChange={(e)=>{markdownChangeHandler(e, field.type)}}
                        />
                    </div>
                  )
                } else if (type === 'checkbox') {

                  return (
                    <div className="mb-3 form" key={'checkbox' + index}>
                      <input type="checkbox" checked={field.value === 'true'? true : false} name={field.type}
                      onChange={(e)=>{
                        field.value = field.value ? '' : 'true'
                        formChangeHandler(e, field.value)}}/>
                      <span className="text ms-3" id="basic-addon1">{field.name}</span>
                    </div>
                  )
                } else if (field.type === 'tags') {
                  return (
                    <div className="mb-3 form" key={'tags' + index}>
                      <span className="text" id="basic-addon1">{field.name}</span>
                      <TextInput className='form-control' defaultValue={field.value} onChange={formChangeHandler} onSelect={formChangeHandler} trigger={["#"]} options={{"#": tags}} />
                    </div>
                  )
                }
                return (

                <div className="mb-3 mt-3" key={field.name + index}>
                <span className="text" id="basic-addon1">{field.name}</span>
                <input type={type} className="form-control" defaultValue={field.value} onChange={formChangeHandler} 
                name={field.type} aria-describedby="basic-addon1" />
                </div>
                )
              })}
              <button type="button" className="btn btn-primary mb-3" onClick={updateItem}>{userData.language === 'en'?'Save changes':'Сохранить изменения'}</button>
              </div>
              </div>
            </div>
              : null
            }
            <div className={displayForms?"display-none":"my-3 p-3 bg-body rounded shadow-sm"}>
            <h1 className="border-bottom pb-2 mb-0">{userData.language === 'en'?'Item info':'Информация о предмете'}
              <button type="button" className="btn btn-primary mb-3 mt-1 ms-3 float-end" onClick={rate}>
              <img 
              id="heart"
              src={liked ? redHeart : whiteHeart} />{userData.language === 'en'?'Like':'Нравится'} | {likesAmount}</button>
            </h1>
            {fieldsArray.map((field, index)=>{
                return field.type.includes('text')?
                    <div className="d-flex text-muted pt-3" key={index} >
                        <p className="pb-3 mb-0 small lh-sm border-bottom border-dark border-1">
                        <strong className="d-block text-gray-dark">{headersArray[index]?headersArray[index].Header:null}</strong>
                        <MDEditor.Markdown 
                        source={field.value}
                        />
                      </p>
                    </div>
                    :
                    <div className="d-flex text-muted pt-3">
                      <p className="pb-3 mb-0 small lh-sm border-bottom border-dark border-1">
                        <strong className="d-block text-gray-dark">{headersArray[index]?headersArray[index].Header:null}</strong>
                      {field.value}
                      </p>
                    </div>
            })}
            
            </div>
            <ToastContainer />
        </div>
        
    )
}

export default ItemInfo
