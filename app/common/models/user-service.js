angular.module('gimmi.authentication', [
  'gimmi.person',
  'gimmi.config',
  'gimmi.models.receiver'
])
  .factory('UserService',
    ['$q', '$localStorage', '$http', 'PersonService', 'receiverModel', 'CONFIG',
    function ($q, $localStorage, $http, PersonService, receiverModel, CONFIG) {
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
          var user = {};
          if (typeof token !== 'undefined' ) {
              var encoded = token.split('.')[1];
              var decoded = JSON.parse(urlBase64Decode(encoded));
              if (! isExpired(decoded.exp)) {
                user = decoded;
              } else {
                delete $localStorage.token;
                currentUser = {};
              }
          }
          return user;
      }

      function isExpired (expDate) {
        if (expDate){
          return expDate <= Date.now()/1000;
        } else {
          return true; //True if the token has not the expiration time field
        }
      }

      function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
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

      // - Is the user also the receiver?
      function userIsReceiver(receiverID){
  			if ( receiverID === getCurrentUser()._id) {
  				return true;
  			} else {
  				return false;
  			}
  		};

      // return available functions for use in the controllers
      return ({
        getCurrentUser: getCurrentUser,
        currentUser: currentUser,
        authenticate: authenticate,
        logout: logout,
        isLoggedIn: isLoggedIn,
        userIsReceiver: userIsReceiver
      });
  }]);
