angular.module('gimmi.authentication', [

])
  .factory('AuthService',
    ['$q', '$localStorage', '$http',
    function ($q, $localStorage, $http) {
      // create user variable
      var user = null;
      var baseUrl = "http://localhost:5000/api";

      function changeUser(user) {
        angular.extend(currentUser, user);
      }
 
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
 
      function getPersonFromToken() {
          var token = $localStorage.token;
          var person = {};
          if (typeof token !== 'undefined') {
              var encoded = token.split('.')[1];
              person = JSON.parse(urlBase64Decode(encoded));
          }
          return person;
      }
 
      var currentPerson = getPersonFromToken();

      function authenticate (email, password) {
        // Create a new instance of deferred
        var deferred = $q.defer();
        // Send a post request to the server
        $http.post(baseUrl + '/authenticate', {email: email, password: password})
        // Handle success
        .success(function(data, status){
          if (status === 200 && data.token) {
            user = true;
            deferred.resolve(data.token);
          } else {
            user = false;
            deferred.reject();
          }
        })
        // Handle error
        .error(function(data){
          user = false;
          deferred.reject();
        });
        // Return promise object
        return deferred.promise;
      }

      function register(person) {
      // create a new instance of deferred
        var deferred = $q.defer();
      // send a post request to the server
        $http.post('http://localhost:5000/api/people',
          { email: person.email,
            password: person.password,
            firstname: person.firstname,
            lastname: person.lastname
          })
          // handle success
          .success(function (data, status) {
            if(status === 200 && data.status){
              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          // handle error
          .error(function (data) {
            deferred.reject();
          });
      // return promise object
        return deferred.promise;
      }
      // return available functions for use in the controllers
      return ({
        getCurrentPerson: currentPerson,
        authenticate: authenticate,
        register: register
      });
  }]);
