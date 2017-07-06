angular.module('gcse')
.factory('gcseService', ['$http', '$q', 'CONFIG',
  function($http, $q, CONFIG){
    return {
      getImageLinks: function(query, resultCount) {
        var url = CONFIG.apiUrl + '/api/gcse/' + query;
        var deferred = $q.defer();

  			$http.get(url).then(function(results){
          var googleImages = [];
          if (results.data) { //images found, save all the links

            /*
            Steek alle searchResults waarin de key 'link' beschikbaar is in een array 'googleImages'
            GoogleImages is een array van urls naar images
            */
            var imagesResults = results.data;
            imagesResults.forEach(function(item){
              if (item.link) {
                googleImages.push(item.link);
              }
            });
            console.info("Images gevonden voor GCSE search: " + query);
          }
          else { //No images found, show default image
            googleImages.push(CONFIG.defaultImage);
            console.error("Geen images gevonden voor GCSE search: " + query);
          }
          deferred.resolve(googleImages);
  			});

  			return deferred.promise;
      }
    };
  }
])
;
