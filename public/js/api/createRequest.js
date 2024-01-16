/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ( options = {} ) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  if (options.method === 'GET'){
    let url = options.url + '?'
    for (let userData in options.data){
      url = url + `${userData}=${options.data[userData]}&`;
    };
    url = url.slice(0 , -1)
    options.url = url
    options.formData = null;

  } else {
    options.formData = new FormData;
    for (let userData in options.data){
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
