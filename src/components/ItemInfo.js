import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import MDEditor from '@uiw/react-md-editor';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

function ItemInfo() {
    const [markdownValue, setMarkdownValue] = useState();
    const [itemFormValue, setItemFormValue] = useState({});
    const [displayButtons, setDisplayButtons] = useState(false);
    const [displayForms, setDisplayForms] = useState(false);
    const [itemData, setItemData] = useState();
    const [headersArray, setHeadersArray] = useState([]);
    const userData = useSelector(store => store.userData);
    const [fieldsArray, setFieldsArray] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
      getHeaders();
      
    },[])

    useEffect(()=>{
      
    },[headersArray])

    useEffect(()=>{
      getItem();
    },[headersArray])



    const getItem = async function(){
        
        try {
          const request = await fetch('https://mycollection-server.herokuapp.com/api/getitem', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    itemId: userData.itemId
                }})
          });
          const response = await request.json();
          if (response.creator === userData.userId) {
            console.log(response.creator === userData.userId)
            setDisplayButtons(true);
          }
          console.log(response);
          setItemData(response);
          let fields = Object.values(response);
          const keys = Object.keys(response);
          fields.splice(0,2);
          fields.splice(-3);
          keys.splice(0,2);
          keys.splice(-3);
          console.log(fields);
          fields = fields.map((field, index)=>{
            let obj;
            if (field === 'name') {
              console.log(field)
              console.log(headersArray[index]);
              return {
                name: headersArray[index].Header,
                value: field,
                type: 'name'
              }
            } else if (field === 'tags') {
              return {
                name: headersArray[index].Header,
                value: field,
                type: 'tags'
              }
            } else {
              return {
                name: headersArray[index].Header,
                value: field,
                type: headersArray[index].fieldType
              }
            }
          })
          console.log(fields)
          setFieldsArray(fields);
            
        } catch (error) {
          console.error(error)
        }

    }

    const getHeaders = async function () {
        try {
            const request = await fetch('https://mycollection-server.herokuapp.com/api/getcollectiontable', 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  data: {
                      collectionId: userData.collectionId
                  }})
            });
            const response = await request.json();
            console.log(response)
            response.headers.shift();
            setHeadersArray([...response.headers]);
            
          } catch (error) {
            console.error(error)
          }
    }

    const getEditForms = function(){

    }

    const toggleItemForms = function(){
      setDisplayForms(prev=>!prev)
    }

    

    const deleteItem = async function(e){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/deleteitems', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: [e.target.dataset.id]})
        });
        const response = await request.json();
        console.log(response);
        setTimeout(()=>{
          toast('item deleted successfully!');
        },100)
        navigate('/mycollections');
      } catch (error) {
        console.error(error)
      }
    }

    const formChangeHandler = function(e){
      console.log(itemFormValue)
      if (e.target.name.includes('checkbox')) {
        setItemFormValue({...itemFormValue, [e.target.name]: String(e.target.checked)})
      } else {
        setItemFormValue({...itemFormValue, [e.target.name]: String(e.target.value)});
        
      }
    }

    const markdownChangeHandler = function(e, formName){
      console.log(itemFormValue)
      if (itemFormValue.formName) {
        const newValue = itemFormValue.formName + e;
        setItemFormValue ({...itemFormValue, [formName]: newValue})
      } else {
        setItemFormValue ({...itemFormValue, [formName]: e})
      }
    }

    const updateItem = async function(){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/updateitem', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: {
            update: itemFormValue,
            itemId: userData.itemId
          }})
        });
        const response = await request.json();
        console.log(response);
        setTimeout(()=>{
          toast('item updated successfully!');
        },100)
        getItem()
      } catch (error) {
        console.error(error)
      }
    }
    

    return (
        <div className='container' style={{'marginTop': '100px'}}>
           {itemData && userData.userId === itemData.creator ?
            <div className={displayButtons ? null  : 'display-none'}>
              <button type="button" className="btn btn-primary mb-3" onClick={toggleItemForms}>Edit item data</button>
              <button type="button" className="btn btn-danger ms-3 mb-3" 
              data-id={userData.itemId} onClick={deleteItem}>Delete item</button>
              <div>
              <div className={displayForms?"form-group":'display-none'}>
              <h1 className="border-bottom pb-2 mb-0">Item data</h1>
              {fieldsArray.map((field, index) => {
                console.log(field.value);
                const type = field.type.substring(0, field.type.length - 6);
                if (type === 'text') {
                  
                  return (

                    <div className="mb-3 mt-3">
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
                    <div className="mb-3 form" key={index}>
                    <input type="checkbox" checked={field.value === 'true'? true : false} name={field.type}
                    onChange={formChangeHandler}/>
                    <span className="text ms-3" id="basic-addon1">{field.name}</span>
                  </div>
                  )
                }
                return (

                <div className="mb-3 mt-3">
                <span className="text" id="basic-addon1">{field.name}</span>
                <input type={type} className="form-control" defaultValue={field.value} onChange={formChangeHandler} 
                name={field.type} aria-describedby="basic-addon1" />
                </div>
                )
              })}
              <button type="button" className="btn btn-primary mb-3" onClick={updateItem}>Save changes</button>
              </div>
              </div>
            </div>
              : null
            }
            <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h1 className="border-bottom pb-2 mb-0">Item data</h1>
            {fieldsArray.map((field, index)=>{
                return field.name.includes('text')?
                    <div className="d-flex text-muted pt-3">
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
