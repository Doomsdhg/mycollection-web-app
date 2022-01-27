export const useRequestHooks = () => {

    const getRequestOptions = function (dataName, data){
        return (
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: {
              [dataName]: data
            }})
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

    const sendPostRequest = async (path, dataName, data, userData, collectionData) => {
        try {
            const request = await fetch(`http://localhost:8080/api/${path}`, getRequestOptions(dataName, data))
            const response = await request.json();
            
            switch (path) {
              case 'getcollectiontable': 
                console.log(response);
                response.headers = checkPermission(response.headers, userData, collectionData)
                const responseHeaders = localizeHeaders(response.headers, userData.language);
                const itemFields = defineItemFields(response.headers);
                console.log(itemFields);
                const items = response.items;
                return {responseHeaders, itemFields, items}
              case 'getcollectiondata':
                response.topic = localizeTopic(response.topic);
                return response
              case 'uploaditem':
                console.log(response);
                return response;
              default:
                break;
            }
          } catch (error) {
            console.log(error);
          }
    }

    return {sendPostRequest}
}