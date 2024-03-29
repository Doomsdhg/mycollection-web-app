export const useRequestHooks = () => {

    const getRequestOptions = function (dataName, data){
        return (
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(!dataName?                               //if dataname is defined, write data to field with such name inside 'data' object
            {...data}:                                                    //otherwise just send data in 'body' of request    
            {data: {
              [dataName]: data
            }}
            )
          }
        )
      }

    const localizeHeaders = function (headers, language) {
      return headers.map(header=>{
        if (header.fieldType === 'id') {
          header.Header = language === 'en' ? 'id' : 'Идентефикатор';
          return header
        } else if (header.fieldType === 'name') {
          header.Header = language === 'en' ? 'name' : 'Название';
          return header
        } else if (header.fieldType === 'tags') {
          header.Header = language === 'en' ? 'tags' : 'Тэги';
          return header
        } else {
          return header
        }
      })
    }

    const checkPermission = function(headers, userData, collectionData){
      if (userData.userId === collectionData.creator || userData.admin) {
        return headers = [{
          Header: userData.language==='en'?'select':'Выбрать',                          //if user is creator of collection or admin, add 'select' column
          accessor: 'select'
        },
        ...headers,
        {
          Header: userData.language==='en'?'Item page':'Страница предмета',
          accessor: 'itemRef'
        }
      ]
      } else {
        return headers = [
          ...headers,
          {
            Header: userData.language==='en'?'Item page':'Страница предмета',
            accessor: 'itemRef'
          }
        ]
      }
    }

    const localizeTopic = function (topic, language){
      switch (topic) {
        case 'Books':
          return topic = language === 'en' ? 'Books' : 'Книги';
        case 'Alcohol':
          return topic = language === 'en' ? 'Alcohol' : 'Алкоголь';
        case 'Other':
          return topic = language === 'en' ? 'Other' : 'Другое';
        default:
          break
      }
    }

    const defineItemFields = function (headers) {
      let headersObject = {};
      headers.map((header)=>{                             
        headersObject = {...headersObject,                      //define initial values for item fields
          [header.fieldType]: '',
        }})
      
      return headersObject;
    }

    const deleteUnnecessaryFields = (response, headersArray) => {
      let indexesToDelete = [];
      let fields = Object.values(response);
      let keys = Object.keys(response);
      indexesToDelete.push(keys.indexOf('likes'));
      indexesToDelete.push(keys.indexOf('comments'));
      indexesToDelete.push(keys.indexOf('creator'));
      indexesToDelete.push(keys.indexOf('collectionRef'));
      indexesToDelete.push(keys.indexOf('__v'));
      indexesToDelete.push(keys.indexOf('_id')); 
      indexesToDelete.map(index=>{                                 //delete unnecessary fields from both arrays
        delete keys[index];
        delete fields[index];
      })
      keys = keys.filter(function( element ) {                     //filter undefined fields after deletion
        return element !== undefined;
      });
      fields = fields.filter(function( element ) {
        return element !== undefined;
      });
      
      fields = fields.map((field, index)=>{
        if (field === undefined) {return field}
        if (field === 'name') {                           
          return {
            name: headersArray[index].Header,
            value: field,
            type: 'name'
          }
        } else if (field === 'tags') {                              //create objects with required data 
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
      return fields
    }

    const sendPostRequest = async (path, dataName, data, userData, extraArgument) => {
        try {
            const request = await fetch(`https://mycollection-server.herokuapp.com/api/${path}`, getRequestOptions(dataName, data))
            const response = await request.json();
            console.log(response)
            if (response && response.message && response.message.includes('Error')){
              throw new Error(response.message)
            } 
            switch (path) {
              case 'getitem':
                console.log(response)
                const fields = deleteUnnecessaryFields(response, extraArgument);
                return {fields, response}
              case 'getcollectiontable': 
                const headers = response.headers;
                const checkedHeaders = checkPermission(response.headers, userData, extraArgument);
                const responseHeaders = localizeHeaders(checkedHeaders, userData.language);
                const itemFields = defineItemFields(checkedHeaders);
                const items = response.items;
                const collectionId = response.collectionId;
                return {responseHeaders, itemFields, items, headers, collectionId}
              case 'getcollectiondata':
                response.topic = localizeTopic(response.topic);
                return {response}
              default:
                return {response}
            }
          } catch (error) {
            console.log(error);
            return {error}
          }
    }

    const sendGetRequest = async (path) => {
      try {
        const request = await fetch(`https://mycollection-server.herokuapp.com/api/${path}`)
        const response = await request.json();
        if (response.message && response.message.includes('Error')){
          throw new Error(response.message)
        }
        switch (path) {
          case 'gettags':
            const tagsArray = Object.keys(response).filter(tag=>tag!=='');
            return {tagsArray, response}
          default:
            return {response}
        }
      } catch (error) {
        console.log(error);
        return {error}
      }
    }

    return {sendPostRequest, sendGetRequest}

}