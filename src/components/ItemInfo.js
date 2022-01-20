import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import MDEditor from '@uiw/react-md-editor';

function ItemInfo() {
    const [itemData, setItemData] = useState();
    const [headersArray, setHeadersArray] = useState([]);
    const userData = useSelector(store => store.userData);
    const [fieldsArray, setFieldsArray] = useState([]);

    useEffect(()=>{
        getItem();
    },[])

    useEffect(()=>{
        console.log(fieldsArray);
    },[fieldsArray])

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
          console.log(response);
          setItemData(response);
          const fields = {...response};
            for (let key in fields) {
                
                if (key.includes('Field') || key.includes('name') || key.includes('tags')){
                    console.log(key)
                    setFieldsArray((previousState)=>{return [...previousState, {
                        name: key,
                        value: fields[key]
                    }]})
                }
            }
            getHeaders();
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
            response.headers.shift();
            setHeadersArray([...response.headers]);
          } catch (error) {
            console.error(error)
          }
    }

    return (
        <div className='container' style={{'marginTop': '100px'}}>
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
        </div>
    )
}

export default ItemInfo
