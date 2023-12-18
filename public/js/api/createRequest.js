/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ( options = {url, data, method, callback} ) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json'; 
  
    if (options.method === 'GET'){
      if (typeof options.method === 'string'){
        options.url += '/' + options.data;

      } else {
        options.url += '?';

        for (userData in options.data){
          options.url =+ `${userData}=${options.data[userData]}&`;
        };
      };

      xhr.open( 'GET', options.url, true);
      xhr.send();

    } else {
      const formData = new FormData;

      for ( userData in options.data){
        formData.append(userData, options.data[userData]);
      };

      xhr.open( options.method, options.url, true );
      xhr.send( formData );
    };

    xhr.onload = () => {
      if (xhr.response.success){
        options.callback(null, xhr.response);
      } else {
        options.callback(new Error (xhr.response.error), null);
      };
    };

    xhr.addEventListener( 'error', () => {
      options.callback(new Error(xhr.statusText), null);
    });
};
