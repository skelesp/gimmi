'use strict';

angular.module('search', [
  'gimmi.config'
])
  .factory('SearchService', ['$http', '$q', 'CONFIG',
    function($http, $q, CONFIG){
      return {
        getSearchResults: function(searchTerm, resultCount) {
          var url = CONFIG.apiUrl + '/api/gcse/' + searchTerm;
          var deferred = $q.defer();

    			$http.get(url).then(function(results){
            deferred.resolve(results);
    			});

    			return deferred.promise;
        }
      };
    }
  ])
  ;
