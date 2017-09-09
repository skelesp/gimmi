angular.module('gimmi.config', [])
  .constant('CONFIG', {
    //apiUrl: 'https://gimmi.herokuapp.com'
    apiUrl: 'http://localhost:5000',
    siteBaseUrl: 'http://localhost/projects/gimmi',
    defaultImage: 'https://image.flaticon.com/icons/png/128/214/214305.png'
  })
;
