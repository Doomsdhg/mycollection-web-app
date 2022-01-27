import React, {useEffect, useState, useMemo} from 'react';
import {useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce} from 'react-table';
import {useSelector} from 'react-redux';
import BTable from 'react-bootstrap/Table';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { useDispatch } from 'react-redux';
import {setItemId} from '../store/reducers';
import {GlobalFilter} from './table';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import {useTableRender} from '../hooks/tableHooks';
import {useRequestHooks} from '../hooks/serverRequestHooks';
import { Typeahead } from 'react-bootstrap-typeahead';

function CollectionTable() {
    const [error, setError] = useState('');
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
    const {sendPostRequest} = useRequestHooks();
    const columns = useMemo(
      () => [...headers],
      [headers]
    )
    const data = useMemo(
      () => [...items],
      [items]
    )

    useEffect(()=>{
      fetchTags();
      fetchCollectionData();
      setItemFormValue({...itemFormValue, 
        collectionRef: userData.collectionId,
        creator: collectionData.creator,
      })
      console.log(tags);
      
    }, [])

    useEffect(()=>{
      if (error) {
        console.log(error)
        toast('' + error);
        setError('')
      }
    }, [error])
    
    const toggleForms = function(){
      const formWrapper = document.getElementById('formWrapper')
      formWrapper.classList.toggle('display-none');
      setDisplayForms(prev=>!prev);
    }

    const fetchTags = async function(){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/gettags')
        const response = await request.json();
        const tagsArray = Object.keys(response)
        console.log(tagsArray);
        setTags([...tagsArray]);
        console.log(tags)
      } catch (error) {
        console.log(error);
      }
    }

    const fetchCollectionData = async function(){
      try {
        const response = await sendPostRequest('getcollectiondata', 'collectionId', userData.collectionId, userData);
        setCollectionData(response);
        console.log(response);
        setMarkdownValue(response.description);
        fetchCollectionTable()
      } catch (error) {
        console.log(error);
      }
    }

    const collectionDataChangeHandler = async function(e){
      setCollectionFormValue({...collectionFormValue, [e.target.name]: e.target.value});
      console.log(collectionFormValue)
    }

    const clearMarkdown = function () {
      setMarkdownValue('')
    }

    const defineItemFields = function (headers) {
      return headers.map((header)=>{
        console.log(header);
        setItemFormValue((prev) => {return {...prev, 
          [header.fieldType]: '',
        }})
      })
    }


    const fetchCollectionTable = async function(){
        try {
          const {
            responseHeaders, 
            itemFields, 
            items} = await sendPostRequest('getcollectiontable', 'collectionId', userData.collectionId, userData, collectionData);
          console.log(responseHeaders, itemFields, items)
          setHeaders(responseHeaders);
          console.log(itemFields);
          setItemFormValue(prev=>{return {...prev, ...itemFields}});
          setItems(items);
        } catch (error) {
          console.log(error);
        }
    }
    
    const table = useTable(
      {columns, data},
      useFilters,
      useGlobalFilter,
      useSortBy,);
      
    const formChangeHandler = function(e){
      if (!e.target) {
        setItemFormValue({...itemFormValue, tags: e[0]})
        return null
      }
      if (e.target.name.includes('checkbox')) {
        setItemFormValue({...itemFormValue, [e.target.name]: String(e.target.checked)})
      } else {
        setItemFormValue({...itemFormValue, [e.target.name]: String(e.target.value)});
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

    const toggleCollectionDataForms = async function (){
      setCollectionFormsDisabled(prev => !prev)
    }

    useEffect(()=>{
      setCollectionFormValue({...collectionFormValue, description: markdownValue});
      console.log(markdownValue);
      console.log(collectionFormValue);
    },[markdownValue])

    const updateCollectionData = async function (){

      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/updatecollection', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: {...collectionFormValue, collectionId: userData.collectionId}})
        });
        const response = await request.json();
        console.log(response.message);
        fetchCollectionData();
        setTimeout(()=>{
          toast(userData.language==='en'?'changes saved successfully!':'изменения сохранены');
        },100)

      } catch (error) {
        console.error(error)
      }
    }

    const deleteCollection = async function(){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/deletecollection', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: {collectionId: userData.collectionId}})
        });
        const response = await request.json();
        console.log(response.message);
        setTimeout(()=>{
          toast(userData.language==='en'?'Collection deleted successfully!':'Коллекция удалена');
        },100)
        navigate('/mycollections')
      } catch (error) {
        console.error(error)
      }
      
    }

    const selectHandler = function(e){
      if (e.target.checked) {
        setSelectedItems((prev)=>{return prev.concat(e.target.dataset.id)})
      } else {
        const indexOfItem = selectedItems.indexOf(e.target.dataset.id);
        setSelectedItems((prev)=>{ 
          prev.splice(indexOfItem, 1)
          return prev
        })
      }
    }

    const checkTagsValidity = function () {
      if (itemFormValue.tags) {
        const tags = itemFormValue.tags.split(' ');
        tags.map(tag=>{
          if (tag[0] !== '#') {
            console.log('Each tag should start with "#"')
            throw new Error (userData.language === 'en'?'Each tag should start with "#"':'Каждый тэг должен начинаться с "#"')
          }
        })
      }
    }

    const uploadItem = async function(){
        try {
          checkTagsValidity()
          await sendPostRequest('uploaditem', 'items', itemFormValue, userData, collectionData)
          toast(userData.language==='en'?'item added successfully!':'предмет успешно добавлен в коллекцию!');
          fetchCollectionTable()
        } catch (e) {
          console.log(e);
          setError(e)
        }
        
    }

    const goToItemPage = function (e) {
      dispatch(setItemId(e.target.dataset.id));
      navigate('/itempage');
    }


    const uncheckSelectedItems = function(){
      const cells = document.querySelectorAll('.checkbox-cell');
      cells.forEach((checkbox)=>{
        checkbox.checked = false;
      })
      console.log(cells);
    }

    const deleteItems = async function(){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/deleteitems', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: [...selectedItems]})
        });
        const response = await request.json();
        console.log(response);
        setTimeout(()=>{
          toast(userData.language==='en'?'item(s) deleted successfully!':'Предметы(ы) удалены');
        },100)
        uncheckSelectedItems()
        setSelectedItems([]);
        fetchCollectionTable()
      } catch (error) {
        console.error(error)
      }
      
    }

    return (
      <>
        <div className='container main-container'> 
        {userData.userId === collectionData.creator ?
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
                {console.log(collectionData.topic)}
              </p>
            </div>
          </div>
          <div className='form-group' style={collectionDataDisabled?{'display':'none'}:null}>
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
          <div id='formWrapper' className='wrapper display-none'>
            {headers.map((header, index)=>{
              
              if (header.accessor === 'select' || header.accessor === '_id' || header.accessor === 'itemRef') return null
              const type = header.fieldType.substring(0, header.fieldType.length - 6);
              if(header.accessor === 'tags') {
                return (
                  <div className="mb-3 form" >
                    <span className="d-block" id="basic-addon1">{header.Header}</span>
                    <Typeahead
                      onChange={(e) => {
                        formChangeHandler(e)
                      }}
                      id='tags'
                      options={tags}
                    />
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
              if (type === 'text') {
                return (
                  <div className="mb-3 form" key={index}>
                  <span className="text" id="basic-addon1">{header.Header}</span>
                  <MDEditor
                    value={itemFormValue[header.fieldType]}
                    name={header.fieldType}
                    onChange={(e)=>{markdownChangeHandler(e, header.fieldType)}}
                  />
                  </div>
                )
              }
              return (
            <div className="mb-3 form" key={index}>
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
