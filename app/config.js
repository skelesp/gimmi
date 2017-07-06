angular.module('gimmi.config', [])
  .constant('CONFIG', {
    //apiUrl: 'https://gimmi.herokuapp.com'
    apiUrl: 'http://localhost:5000',
    siteBaseUrl: 'http://localhost/projects/gimmi',
    defaultImage: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTaO2OnPKQ3_p3RdI1KZkj6XP-8il5iRO9iGj9Xj8TT0KuKTE_Ynw'
  })
;
