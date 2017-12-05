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
        if (id) {
          $http.get(CONFIG.apiUrl + '/api/people/'+id)
            .success(function(person){
              if (person) {
                deferred.resolve(person);
              } else {
                deferred.reject("Person not found.");
              }
            })
            .error(function(data){
              deferred.reject(data.error);
            });
        } else {
          deferred.reject("No id provided");
        }

  			return deferred.promise;
  		}
      
      function updatePersonDetails (person){
        var deferred = $q.defer();
        console.log("Person to update:", person);
        if (person) {
          $http.put(CONFIG.apiUrl + '/api/people/' + person._id, person)
            .success(function(person){
              deferred.resolve(person);
            })
            .error(function(error){
              deferred.reject({error: "something went wrong"});
            });
        } else {
          deferred.reject({error: "No person object found"});
        }
        return deferred.promise;
      }

      function updatePassword (person, pw){
        var deferred = $q.defer();
        
        if (pw) {
          var body = {
            pw: pw
          }
          $http.put(CONFIG.apiUrl + '/api/people/' + person._id + '/password', body)
          .success(function(person){
            console.log("Wachtwoord werd gewijzigd voor " + person._id);
            deferred.resolve(person);
          })
          .error(function(error){

          });
        } else {
          deferred.reject("Er is geen wachtwoord ingegeven.");
        }

        return deferred.promise;
      }

      function updateAccounts (person){

      }
      // - return available functions for use in the controllers -
      return ({
        register: register,
        getPersonFromToken: getPersonFromToken,
        getPersonFromID: getPersonFromID,
        updatePersonDetails: updatePersonDetails,
        updatePassword: updatePassword
      });
    }]);
