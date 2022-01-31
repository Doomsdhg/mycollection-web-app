import React, {useEffect, useState, useMemo} from 'react';
import {useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce} from 'react-table';
import {useSelector} from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { useDispatch } from 'react-redux';
import {setItemId, setCollectionId} from '../store/reducers';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import {useTableRender} from '../hooks/tableHooks';
import {useRequestHooks} from '../hooks/serverRequestHooks';

function CollectionTable() {
    const [tags, setTags] = useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const [markdownValue, setMarkdownValue] = useState();
    const [collectionFormValue, setCollectionFormValue] = useState({});
    const [collectionDataDisabled, setCollectionFormsDisabled] = useState(true);
    const [collectionData, setCollectionData] = useState('');
    const [itemFormValue, setItemFormValue] = useState({});
    const [displayForms, setDisplayForms] = useState(false);
    const [headers, setHeaders] = useState([]);
    const [items, setItems] = useState([]);
    const {renderCollectionTable} = useTableRender();
    const userData = useSelector(store => store.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {sendPostRequest, sendGetRequest} = useRequestHooks();
    const columns = useMemo(
      () => [...headers],
      [headers]
    )
    const data = useMemo(
      () => [...items],
      [items]
    )
    const table = useTable(
      {columns, data},
      useFilters,
      useGlobalFilter,
      useSortBy,);

    useEffect(()=>{
      const collectionId = getCollectionId();                //rerender if language changed
      fetchTags();
      fetchCollectionData();
      setItemFormValue(prev=>{return{...prev, 
        collectionRef: collectionId,
        creator: collectionData.creator,
      }})
    }, [userData.language])
    
    useEffect(()=>{
      setCollectionFormValue({...collectionFormValue, description: markdownValue});                // handler for markdown input changes
    },[markdownValue])

    const toggleForms = function(){
      const formWrapper = document.getElementById('formWrapper')                // display/hide forms
      formWrapper.classList.toggle('display-none');
      setDisplayForms(prev=>!prev);
    }

    const formChangeHandler = function(e){                                // handle input changes 
      if (!e.target) {
        setItemFormValue(prev=>{return{...prev, tags: e}})                // handle autocomplete input
        return null
      } else if (e.target.name.includes('checkbox')) {
        setItemFormValue(prev=>{return{...prev, [e.target.name]: String(e.target.checked)}})          // handle checkbox input
        return null
      } else {
        setItemFormValue(prev=>{return{...prev, [e.target.name]: String(e.target.value)}});          // handle regular input
        return null
      }
    }

    const collectionDataChangeHandler = async function(e){
      setCollectionFormValue({...collectionFormValue, [e.target.name]: e.target.value});          // handle collection data changes input
    }

    const markdownChangeHandler = function(e, formName){
      if (itemFormValue.formName) {                 
        const newValue = itemFormValue.formName + e;                              // if field with such name already exists, add last input symbol to this field
        setItemFormValue (prev=>{return{...prev, [formName]: newValue}})
      } else {
        setItemFormValue (prev=>{return{...prev, [formName]: e}})                 // else initialize field with this name
      }
    }

    const toggleCollectionDataForms = async function (){
      setCollectionFormsDisabled(prev => !prev)                                  // toggle collection data input forms
    }

    const selectHandler = function(e){                                              // handler for item's select checkboxes
      if (e.target.checked) {
        setSelectedItems((prev)=>{return prev.concat(e.target.dataset.id)})        // if item is selected, add its id to array of selected items
      } else {
        const indexOfItem = selectedItems.indexOf(e.target.dataset.id);  
        setSelectedItems((prev)=>{ 
          prev.splice(indexOfItem, 1)                                              // if user unchecked the item, remove its id from array
          return prev
        })
      }
    }

    const checkTagsValidity = function () {
      if (itemFormValue.tags) {
        const tags = itemFormValue.tags.split(' ').filter(tag => tag !== '' && tag !== ' ');              // if user typed some tags, filter extra spaces and empty strings
        tags.map(tag=>{
          if (tag[0] !== '#') {
            throw new Error (userData.language === 'en'?'Each tag should start with "#"':'Каждый тэг должен начинаться с "#"') 
          }
        })
        setItemFormValue(prev=>{return{...prev, tags: tags.join()}})
      }
    }

    const getCollectionId = function () {
      const indexOfId = window.location.href.indexOf('id=') + 3;                       //get collection id from address bar
      const id = window.location.href.substring(indexOfId);
      dispatch(setCollectionId(id));
      return id
    }

    const goToItemPage = function (e) {
      dispatch(setItemId(e.target.dataset.id));
      navigate(`/itempage?id=${e.target.dataset.id}`);
    }

    const uncheckSelectedItems = function(){
      const cells = document.querySelectorAll('.checkbox-cell');
      cells.forEach((checkbox)=>{
        checkbox.checked = false;
      })
    }

    const fetchTags = async function(){
      try {
        const {tagsArray, error} = await sendGetRequest('gettags')
        if (error) {
          throw new Error(error)
        }
        setTags(prev=>{return[...tagsArray.map(tag => tag.substring(1))]});
      } catch (e) {
        toast('' + e)
      }
    }

    const fetchCollectionData = async function(){
      try {
        const collectionId = getCollectionId();
        const {response, error} = await sendPostRequest('getcollectiondata', 'collectionId', collectionId, userData);
        if (error) {
          throw new Error(error)
        }
        setCollectionData(prev=>{return response});
        setMarkdownValue(response.description);
        fetchCollectionTable(response)
      } catch (e) {
        toast('' + e)
      }
    }

    const fetchCollectionTable = async function(response = collectionData){
        try {
          const collectionId = getCollectionId();
          const {
            responseHeaders, 
            itemFields, 
            items,
            error} = await sendPostRequest('getcollectiontable', 'collectionId', collectionId, userData, response);
          if (error) {
            throw new Error(error)
          }
          setHeaders(responseHeaders);
          setItemFormValue(prev=>{return {...prev, ...itemFields}});
          setItems(items);
        } catch (e) {
          toast('' + e)
        }
    }

    const updateCollectionData = async function (){
      try {
        const update = {...collectionFormValue, collectionId: userData.collectionId};
        const {error} = await sendPostRequest('updatecollection', 'update', update, userData)
        if (error) {
          throw new Error(error)
        }
        fetchCollectionData()
        toast(userData.language==='en'?'changes saved successfully!':'изменения сохранены');
      } catch (e) {
        toast('' + e)
      }
    }

    const deleteCollection = async function(){
      try {
        const {error} = await sendPostRequest('deletecollection', 'collectionId', userData.collectionId, userData)
        if (error) {
          throw new Error(error)
        }
        setTimeout(()=>{
          toast(userData.language==='en'?'Collection deleted successfully!':'Коллекция удалена');         //show message after redirect
        },100)
        navigate(`/mycollections?id=${userData.profileId}`)                        //redirect to last watched collection profile
      } catch (e) {
        toast('' + e)
      }
    }

    const uploadItem = async function(){
        try {
          checkTagsValidity()
          const {error} = await sendPostRequest('uploaditem', 'items', itemFormValue, userData, collectionData);
          if (error) {
            throw new Error(error)
          }
          window.location.reload()
        } catch (e) {
          toast('' + e)
        }
    }

    const deleteItems = async function(){
      try {
        const itemsData = {
          itemsToDelete: selectedItems,
          collectionRef: userData.collectionId
        }
        const {error} = await sendPostRequest('deleteitems', 'itemsData', itemsData, userData)
        if (error) {
          throw new Error(error)
        }
        toast(userData.language==='en'?'item(s) deleted successfully!':'Предметы(ы) удалены');
        uncheckSelectedItems()
        setSelectedItems([])                                            //remove deleted items from local array
        fetchCollectionTable()                                          //rerender table
      } catch (e) {
        toast('' + e)
      }
    }

    return (
      <>
        <div className='container main-container'> 
          
        {userData.userId === collectionData.creator || userData.admin?
        <>
          <button type="button" className="btn btn-primary mb-3" onClick={toggleCollectionDataForms}>{userData.language==='en'?'Edit collection info':'Изменить информацию о коллекции'}</button>
          <button type="button" className="btn btn-danger ms-3 mb-3" onClick={deleteCollection}>{userData.language==='en'?'Delete collection':'Удалить коллекцию'}</button>
        </>
          : null
        }
          <div className="my-3 p-3 bg-body rounded shadow-sm" style={collectionDataDisabled?null:{'display':'none'}}>
            <h1 className="border-bottom pb-2 mb-0">{userData.language==='en'?'Collection data':'Информация о коллекции'}</h1>
            <div className="d-flex text-muted pt-3">
              

              <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">{userData.language==='en'?'Collection name':'Название коллекции'}</strong>
              {collectionData.name}
              </p>
            </div>
            <div className="d-flex text-muted pt-3">
              

              <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">{userData.language==='en'?'Collection description':'Описание коллекции'}</strong>
                <MDEditor.Markdown 
                  source={markdownValue} 
                />
              </p>
            </div>
            <div className="d-flex text-muted pt-3">
              

              <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">{userData.language==='en'?'Collection topic':'Категория'}</strong>
                {collectionData.topic}
              </p>
            </div>
          </div>
          <div className='form-group p-2' style={collectionDataDisabled?{'display':'none'}:null}>
          <h1 className="border-bottom pb-2 mb-0">{userData.language==='en'?'Collection data':'Информация о коллекции'}</h1>
            <div className="mb-3 mt-3">
              <span className="text" id="basic-addon1">{userData.language==='en'?'Collection name':'Название коллекции'}</span>
              <input type="text" className="form-control" defaultValue={collectionData.name} onChange={collectionDataChangeHandler} 
              name='name' disabled={collectionDataDisabled?true:false} placeholder="My collection" aria-describedby="basic-addon1" />
            </div>
            <div className="">
              <span className="-text">{userData.language==='en'?'Collection description':'Описание коллекции'}</span>
              <MDEditor
                value={markdownValue}
                onChange={setMarkdownValue}
                name='description'
                id='description'
              />
              


            </div>
            <div className="container">

            </div>
            <div className="mb-3 mt-3">
              <label className="-text" htmlFor="inputGroupSelect01">Topic</label>
              <select className="form-select" onChange={collectionDataChangeHandler} name='topic' 
              disabled={collectionDataDisabled?true:false} id="inputGroupSelect01">
                <option >{userData.language==='en'?'Choose...':'Выберите'}</option>
                <option selected={collectionData.topic==='Books'?true:false} value="Books">{userData.language==='en'?'Books':'Книги'}</option>
                <option selected={collectionData.topic==='Alcohol'?true:false} value="Alcohol">{userData.language==='en'?'Alcohol':'Алкоголь'}</option>
                <option selected={collectionData.topic==='Other'?true:false} value="Other">{userData.language==='en'?'Other':'Другое'}</option>
              </select>
            </div>
            <button type="button" className="btn btn-success mb-3" onClick={updateCollectionData}>{userData.language==='en'?'Save collection info changes':'Сохранить изменённые данные'}</button>
          </div>
          
          { (userData.userId === collectionData.creator || userData.admin) && selectedItems.length !== 0?
          <button type="button" className="btn btn-danger mb-3 mt-3" onClick={deleteItems}>{userData.language==='en'?'Delete selected items':'Удалить выбранные предметы'}</button>
          : null
          }
          {renderCollectionTable(table, headers, selectHandler, goToItemPage, userData, collectionData)}
          {userData.userId === collectionData.creator || userData.admin?
          <button type="button" className="btn btn-success mb-3 d-inline" onClick={toggleForms}>
                {userData.language==='en'?displayForms?'Close console':'Open console of item adding':displayForms?'Закрыть консоль':'Открыть консоль добавления предмета'}</button>
            : null
          }
          <div id='formWrapper' className='wrapper p-3 display-none'>
            {headers.map((header, index)=>{
              
              if (header.accessor === 'select' || header.accessor === '_id' || header.accessor === 'itemRef') return null      //not rendering input fields for unchangeable values
              const type = header.fieldType.substring(0, header.fieldType.length - 6);                                         //get input type
              if(header.accessor === 'tags') {                                                                                 //render autocomplete input for tags
                return (
                  <div className="mb-3 form">
                    <span id="basic-addon1">{header.Header}</span>
                    <TextInput className='form-control tags' onChange={formChangeHandler} onSelect={formChangeHandler} trigger={["#"]} options={{"#": tags}} />
                  </div>
                )
              }
              if (type === 'checkbox') {
                return (
                  <div className="mb-3 form" key={index}>
                    <input type="checkbox" value={false} name={header.fieldType}
                    onChange={formChangeHandler}/>
                    <span className="text ms-3" id="basic-addon1">{header.Header}</span>
                  </div>
                )
              }
              if (type === 'text') {                                                            //render markdown input for 'text' type columns
                return (
                  <div className="mb-3 form" key={index}>
                  <span className="text" id="basic-addon1">{header.Header}</span>
                  <MDEditor
                    value={itemFormValue[header.fieldType]}
                    name={header.fieldType}
                    id={'markdown'}
                    onChange={(e)=>{markdownChangeHandler(e, header.fieldType)}}
                  />
                  </div>
                )
              }
              return (
            <div className="mb-3 form" key={index}>                                       {/*render regular input*/}
              <span className="text" id="basic-addon1">{header.Header}</span>                                 
              <input type={type}
              className="form-control" 
              name={header.fieldType} 
              placeholder={type} 
              onChange={formChangeHandler} />
            </div>
              )
            })}
            <button type="button" className="btn btn-success mb-3" onClick={uploadItem}>{userData.language === 'en'?'Add new item':'Добавить новый предмет'}</button>
          </div>
          
        </div>
      <ToastContainer />
      </>
    )
}

export default CollectionTable
