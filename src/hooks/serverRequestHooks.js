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

    const sendPostRequest = async (path, dataName, data, userData) => {
        try {
            const request = await fetch(`https://mycollection-server.herokuapp.com/api/${path}`, getRequestOptions(dataName, data))
            const response = await request.json();
            const responseHeaders = localizeHeaders(response.headers, userData.language);
            const itemFields = response.headers;
            const items = response.items;
            console.log(response);
            return {responseHeaders, itemFields, items}
          } catch (error) {
            console.log(error);
          }
    }
    return {sendPostRequest}
}