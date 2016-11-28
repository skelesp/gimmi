angular.module('gimmi.authentication', [
  'gimmi.person'
])
  .factory('UserService',
    ['$q', '$localStorage', '$http', 'PersonService',
    function ($q, $localStorage, $http, PersonService) {
      // create user variable
      var baseUrl = CONFIG.apiUrl + '/api';
      var currentUser = getUserFromStorage();

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
 
      function getUserFromStorage() {
          var token = $localStorage.token;
          var person = {};
          if (typeof token !== 'undefined') {
              var encoded = token.split('.')[1];
              person = JSON.parse(urlBase64Decode(encoded));
          }
          return person;
      }

      function isLoggedIn(){
        return !angular.isUndefined(currentUser);
      }
      // - Authenticate a person on the server -
      function authenticate (email, password) {
        // Create a new instance of deferred
        var deferred = $q.defer();
        // Send a post request to the server
        $http.post(baseUrl + '/authenticate', {email: email, password: password})
        // Handle success
        .success(function(data, status){
          if (status === 200 && data.token) {
            $localStorage.token = data.token;
            currentUser = PersonService.getPersonFromToken(data.token);
            deferred.resolve(currentUser);
          } else {
            deferred.reject();
          }
        })
        // Handle error
        .error(function(data){
          deferred.reject();
        });
        // Return promise object
        return deferred.promise;
      }

      // - Logout a person -
      function logout(){
        delete $localStorage.token;
        currentUser = {};
      }

      // - Get current user
      function getCurrentUser () {
        return currentUser;
      }

      // return available functions for use in the controllers
      return ({
        getCurrentUser: getCurrentUser,
        currentUser: currentUser,
        authenticate: authenticate,
        logout: logout,
        isLoggedIn: isLoggedIn
      });
  }]);
