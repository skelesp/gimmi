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
  .controller('SearchController', ['SearchService',
    function(SearchService){
      var _self = this;

      _self.searchResults = {};
      _self.searchTerm = "Lamzac";
      _self.resultCount = "10";
      _self.submit = function() {
        _self.searchTerm = _self.searchTerm.trim();
        if (_self.searchTerm){
          SearchService.getSearchResults(_self.searchTerm)
            .then(function (results) {
              //_self.searchResults = JSON.parse(results);
              _self.searchResults = results.data;
              console.log(_self.searchResults);
            });
        }
      };
      _self.submit();
    }

    /* TODOlist
    TODO: Wijzig AngularJS code zodat het met de items overweg kan
    TODO: Geef de items weer op de site
    TODO: Zoek op basis van de titel
    TODO: Geef de foto's weer bij de klik op een knop...
    TODO: Maak de items clickable zodat die foto opgeslaan wordt
    */

  ]);
