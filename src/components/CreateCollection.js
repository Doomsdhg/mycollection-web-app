import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import MDEditor from '@uiw/react-md-editor';
import {setImageURL} from '../store/reducers';
import {useRequestHooks} from '../hooks/serverRequestHooks';

function CreateCollection() {
    const dispatch = useDispatch();
    const [markdownValue, setMarkdownValue] = useState();
    const navigate = useNavigate();
    const userData = useSelector(state => state.userData);
    const [formValue, setFormValue] = useState({});
    const [itemFields, setItemFields] = useState([]);
    const [drag, setDrag] = useState(false);
    const {sendPostRequest} = useRequestHooks();
    const dragStartHandler = function (e) {
        e.preventDefault();
        setDrag(true);
    }
    const dragLeaveHandler = function (e) {
        e.preventDefault();
        setDrag(false);
    }
    const dropHandler = async function (e) {
        e.preventDefault();
        let files = [...e.dataTransfer.files];
        const formData = new FormData();
        formData.append('file', files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onloadend = ()=>{
          toast(userData.language === 'en'?'Wait for image to upload':'Подождите пока картинка загрузится')
          uploadImage(reader.result);
        }
        
        setDrag(false);
    }

    useEffect(()=>{
      setFormValue({...formValue, description: markdownValue});
    },[markdownValue])

    useEffect(()=>{
      setFormValue({creator: userData.profileId});
    },[]);


    const changeHandler = function(e){
      setFormValue({...formValue, [e.target.name]: e.target.value});
    }

    const addField = function(e){
      try {
        let fieldType = e.target.name;
        let fieldTypeAmount = itemFields.filter(item => item === fieldType) 
        if (fieldTypeAmount.length >= 3) {
          throw new Error(userData.language === 'en'?'You can not add more than 3 fields of each type':'Вы не можете добавить больше 3-х полей каждого типа')
        }
        setItemFields(itemFields.concat([fieldType]));
      } catch (e) {
        toast('' + e)
      }
    }

    const getIndex = function(formName, formIndex){                             //get index for name of input
      const fieldsArr = [...itemFields];
      fieldsArr.sort();
      if (formIndex === fieldsArr.indexOf(formName)) {
        return 1
      } else if (formIndex === fieldsArr.lastIndexOf(formName)) {
        return 3
      } else {
        return 2
      }
    }

    const submitHandler = function (e) {
      uploadCollection()
    }

    const uploadImage = async function(image){
        try {
          const {error, response} = await sendPostRequest('uploadimage', 'img', image)
          if (error) {
            throw new Error(error);
          } 
          const imageURL = response.url;
          dispatch(setImageURL(imageURL))      
          toast(userData.language === 'en'?'Image successfully uploaded to server!':'Картинка успешно загружена на сервер');
        } catch (e) {
          toast('' + e)
        }
    }

    const uploadCollection = async function(){
      try {
        const updateData = {...formValue, imageURL: userData.imageURL}
        console.log(updateData)
        const {error} = await sendPostRequest('uploadcollection', 'updateData', updateData)
        if (error) {
          throw new Error(error)
        }
        dispatch(setImageURL(''))                                                                     //nullify image url
        navigate(`/mycollections?id=${userData.profileId}`);                                          //redirect to last seen collectioner profile 
        setTimeout(()=>{
          toast(userData.language === 'en'?'Collection created successfully!':'Коллекция создана!');  //show message after redirect
        },100)
      } catch (e) {
        if (String(e).includes('ValidationError')){
          toast(userData.language==='en'?'you need to fill every required field':'нужно заполнить все обязательные поля')
        } else {
          toast('' + e)
        }
      }
    }

    return (
        <div className='container main-container'>  
          <div className='d-block p-2'>
            <h3>{userData.language === 'en'?'Enter data for your future collection':'Введите информацию о коллекции'}</h3>
            <small className='text-danger'>* - {userData.language==='en'?'required fields':'обязательные поля'}</small>
            <div className="mb-3 mt-2">
              <span className="text" id="basic-addon1">{userData.language === 'en'?'Collection name':'Название коллекции'} *</span>
              <input type="text" className="form-control" name='name' placeholder={userData.language === 'en'?'My collection':'Моя коллекция'} onChange={changeHandler} aria-describedby="basic-addon1" />
            </div>

            <div className="mb-3">
              <span className="text" id="basic-addon1">{userData.language === 'en'?'Collection description':'Описание коллекции'} *</span>
              <MDEditor
                value={markdownValue}
                onChange={setMarkdownValue}
                name='description'
              />
            </div>
            

            <div className="mb-3 mt-3">
              <label className="-text" htmlFor="inputGroupSelect01">{userData.language === 'en'?'Topic':'Категория'} *</label>
              <select className="form-select" name='topic' id="inputGroupSelect01" onChange={changeHandler}>
                <option defaultValue={true}>{userData.language === 'en'?'Choose...':'Выберите...'}</option>
                <option value="Books">{userData.language === 'en'?'Books':'Книги'}</option>
                <option value="Alcohol">{userData.language === 'en'?'Alcohol':'Алкоголь'}</option>
                <option value="Other">{userData.language === 'en'?'Other':'Другое'}</option>
              </select>
            </div>

            
              {userData.imageURL?                                                     //show image if it's already uploaded to server
              <img src={userData.imageURL} alt='unable to upload'/>:
              <div className="drag-n-drop-area">
                {drag?
                <div className ="drag-n-drop hovered"
                onDragStart={e => {dragStartHandler(e)}}
                onDragLeave={e => {dragLeaveHandler(e)}}
                onDragOver={e => {dragStartHandler(e)}}
                onDrop={e => {dropHandler(e)}}
                >{userData.language === 'en'?'Collection image (optional). Drop files to upload':'Картинка коллекции (опционально). Отпустите файлы, чтобы загрузить'}</div>:
                <div className ="drag-n-drop empty"
                onDragStart={e => {dragStartHandler(e)}}
                onDragLeave={e => {dragLeaveHandler(e)}}
                onDragOver={e => {dragStartHandler(e)}}
                >{userData.language === 'en'?'Collection image (optional). Drag files here':'Картинка коллекции (опционально). Перенесите файлы сюда'}</div>
                }
              </div>}
            
            <div className='wrapper mt-3'>
              <h3>{userData.language === 'en'?'Fields for each collection item':'Поля, которые будут применены для каждого предмета коллекции'}</h3>
              <p>{userData.language === 'en'?'(You can add up to 3 fields of each type)':'Вы можете добавить до 3-х полей каждого типа'}</p>
              <div className="btn-group" role="group" aria-label="Basic outlined example">
                <button type="button" className="btn btn-outline-success" name="number" onClick={e => addField(e)}>{userData.language==='en'?'Add numeric field':'Добавить числовое поле'}</button>
                <button type="button" className="btn btn-outline-success" name="string" onClick={e => addField(e)}>{userData.language==='en'?'Add string field':'Добавить строковое поле'}</button>
                <button type="button" className="btn btn-outline-success" name="text" onClick={e => addField(e)}>{userData.language==='en'?'Add text field':'Добавить текстовое поле'}</button>
                <button type="button" className="btn btn-outline-success" name="date" onClick={e => addField(e)}>{userData.language==='en'?'Add date field':'Добавить поле с датой'}</button>
                <button type="button" className="btn btn-outline-success" name="checkbox" onClick={e => addField(e)}>{userData.language==='en'?'Add checkbox field':'Добавить поле с чекбоксом'}</button>
              </div>
            </div>
              <p>{userData.language === 'en'?'Each item in this collection will include following fields:':'Каждый предмет в этой коллекции будет содержать следующие поля:'}</p>
            <div className="mb-3">
              <span className="-text" id="basic-addon1">{userData.language === 'en'?'Item id':'Идентефикатор предмета'}</span>
              <input type="text" disabled={true} className="form-control" placeholder="61efc441359278e47069939b" aria-describedby="basic-addon1" />
            </div>

            <div className="">
              <span className="-text">{userData.language === 'en'?'Item name':'Название предмета'}</span>
              <textarea className="form-control"  disabled={true} aria-label="With textarea" placeholder={userData.language === 'en'?'Item 1':'Предмет 1'}></textarea>
            </div>

            <div className="mt-3">
              <span>{userData.language === 'en'?'Tags':'Тэги'}</span>
              <textarea className="form-control"  disabled={true} aria-label="With textarea" placeholder='#qwe #zxc'></textarea>
            </div>
            {itemFields.sort().map((item, index) => (
              <div className="mt-3" key={index}>
              <span className="text">{item} field</span>
              <textarea className="form-control" name={item + "Field" + getIndex(item, index)} aria-label="With textarea" onChange={changeHandler} placeholder={userData.language === 'en'?'Type field name here':'Введите название поля'}>
              </textarea>
              </div>
            ))}
            <button type="button" className="btn btn-success mt-3 mb-3" onClick={submitHandler}>{userData.language === 'en'?'Create':'Создать'}</button>
            <ToastContainer />
          </div>
        </div>
    )
}

export default CreateCollection
