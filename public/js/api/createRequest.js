/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ( options = {} ) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  if (options.method === 'GET'){
    options.url = options.url + '?'
    for (userData in options.data){
      options.url = options.url + `${userData}=${options.data[userData]}&`;
    };
    options.url.slice(0 , options.url.length - 1)
    options.formData = null;

  } else {
    options.formData = new FormData;
    for ( userData in options.data){
     options.formData.append(userData, options.data[userData]);
    };
  };

  xhr.addEventListener('load', () => {
    if (xhr.response.success){
      options.callback(null, xhr.response);
    } else {
      options.callback(xhr.response.error, null);
    };
  });

  xhr.addEventListener( 'error', () => {
    options.callback(xhr.statusText, null);
  });

  try{
    xhr.open( options.method, options.url, true );
    xhr.send(options.formData );
  } catch (err) {
    options.callback(err, null)
  };
};
