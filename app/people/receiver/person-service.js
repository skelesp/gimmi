angular.module('gimmi.person', [
  'gimmi.config'
])
  .factory('PersonService',
    ['$q', '$http', 'CONFIG',
    function ($q, $http, CONFIG) {

      function urlBase64Decode(str) {
          var output = str.replace('-', '+').replace('_', '/');
          switch (output.length % 4) {
              case 0:
                  break;
              case 2:
                  output += '==';
                  break;
              case 3:
                  output += '=';
                  break;
              default:
                  throw 'Illegal base64url string!';
          }
          return window.atob(output);
      }
 
      function getPersonFromToken(token) {
          var person = {};
          if (typeof token !== 'undefined') {
              var encoded = token.split('.')[1];
              person = JSON.parse(urlBase64Decode(encoded));
          }
          return person;
      }

      // - Register a person to the server -
      function register(person, config) {
        // create a new instance of deferred
        var deferred = $q.defer();
        // send a post request to the server
        $http.post(CONFIG.apiUrl + '/api/people', person)
          .success(function (data, status) {
            if(status === 201 && data.token){
              deferred.resolve(data.token);
            } else {
              deferred.reject("Succes, but no token available");
            }
          })
          .error(function (data) {
            deferred.reject(data.error);
          });
          // return promise object
        return deferred.promise;
      } // - End of register -

      // - Get person from ID
      function getPersonFromID (id) {
  			var deferred = $q.defer();

        $http.get(CONFIG.apiUrl + '/api/people/'+id)
          .success(function(person){
            if (person) {
              deferred.resolve(person);
            } else {
              var error = "Person not found."
              deferred.reject(error);
            }
          })
          .error(function(data){
            deferred.reject(data.error);
          });

  			return deferred.promise;
  		}

      // - return available functions for use in the controllers -
      return ({
        register: register,
        getPersonFromToken: getPersonFromToken,
        getPersonFromID: getPersonFromID
      });
    }]);
