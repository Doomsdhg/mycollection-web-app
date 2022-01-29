export const useRequestHooks = () => {

    const getRequestOptions = function (dataName, data){
        return (
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(!dataName?
            {...data}:
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
          Header: userData.language==='en'?'select':'Выбрать',
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
        console.log(header);
        headersObject = {...headersObject, 
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
      console.log(indexesToDelete);
      indexesToDelete.map(index=>{
        delete keys[index];
        delete fields[index];
      })
      keys = keys.filter(function( element ) {
        return element !== undefined;
      });
      fields = fields.filter(function( element ) {
        return element !== undefined;
      });
      
      console.log(fields);
      fields = fields.map((field, index)=>{
        console.log(field)
        if (field === undefined) {return field}
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
          console.log(keys);
          console.log(fields);
          console.log(field);
          console.log(headersArray)
          console.log(headersArray[index])
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
            switch (path) {
              case 'getitem':
                const fields = deleteUnnecessaryFields(response, extraArgument);
                return {fields, response}
              case 'getcollectiontable': 
                console.log(response);
                const headers = response.headers;
                const checkedHeaders = checkPermission(response.headers, userData, extraArgument)
                const responseHeaders = localizeHeaders(checkedHeaders, userData.language);
                const itemFields = defineItemFields(checkedHeaders);
                console.log(itemFields);
                const items = response.items;
                return {responseHeaders, itemFields, items, headers}
              case 'getcollectiondata':
                response.topic = localizeTopic(response.topic);
                return response
              case 'authentication':
                if (!response.token){
                  throw new Error(response.message);
                }
                return response
              default:
                return response
            }
          } catch (error) {
            console.log(error);
            return error
          }
    }

    const sendGetRequest = async (path) => {
      try {
        const request = await fetch(`https://mycollection-server.herokuapp.com/api/${path}`)
        const response = await request.json();
        switch (path) {
          case 'gettags':
            const tagsArray = Object.keys(response).filter(tag=>tag!=='');
            return {tagsArray, response}
          default:
            return response
        }
      } catch (error) {
        console.log(error);
        return error
      }
    }

    return {sendPostRequest, sendGetRequest}

}