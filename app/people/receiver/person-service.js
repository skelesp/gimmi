angular.module('gimmi.person', [

])
  .factory('PersonService',
    ['$q', '$http',
    function ($q, $http) {

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
      function register(person) {
        // create a new instance of deferred
        var deferred = $q.defer();
        // send a post request to the server
        $http.post('http://localhost:5000/api/people', person)
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

      // - return available functions for use in the controllers -
      return ({
        register: register,
        getPersonFromToken: getPersonFromToken
      });
    }]);
