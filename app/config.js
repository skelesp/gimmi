angular.module('gimmi.config', [])
  .constant('CONFIG', {
    //apiUrl: 'https://gimmi.herokuapp.com'
    apiUrl: 'http://192.168.0.136:5000',
    siteBaseUrl: 'http://127.0.0.1:5500',
    defaultImage: 'https://image.flaticon.com/icons/png/128/214/214305.png'
  })
;
