angular.module('gimmi.authentication', [
  'gimmi.person',
  'gimmi.config',
  'gimmi.models.receiver'
])
  .factory('UserService',
    ['$q', '$localStorage', '$http', '$state', '$rootScope', 'PersonService', 'receiverModel', 'CONFIG',
    function ($q, $localStorage, $http, $state, $rootScope, PersonService, receiverModel, CONFIG) {
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
          return decodeURIComponent(escape(window.atob(output)));
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
        $http.post(baseUrl + '/authenticate', {email: email, password: password, account: "local"})
        // Handle success
        .success(function(data, status){
          if (status === 200 && data.token) {
            $localStorage.token = data.token;
            currentUser = PersonService.getPersonFromToken(data.token);
            $rootScope.$emit('login', currentUser);
            $rootScope.$broadcast('login', currentUser);
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

      // - Login to Facebook
      function logInFacebook (){
        var defer = $q.defer();
        FB.login(function(res){
          statusChangeCallbackFacebook(res)
            .then(function(user){
              defer.resolve(user);
            })
            .catch(function(){
              defer.reject();
            })
            ;
        }, { 
          scope: 'public_profile,email,user_friends,publish_actions', 
          return_scopes: true
        });
        return defer.promise;
      }

      // - Watch the FB authentication status
      function checkLoginStatus () {
        FB.getLoginStatus(function(res){
         
          statusChangeCallbackFacebook(res);
          
        });
      };

      // - Handle Facebook authResponse
      function statusChangeCallbackFacebook (res){
        var defer = $q.defer();
        if (res.status === 'connected') {
          /*
          The user is already logged,
          is possible retrieve his personal info
          */
          /* 
          The response object will look like this:
          {
            status: 'connected',
              authResponse: {
              accessToken: '...',
                expiresIn:'...',
                  signedRequest:'...',
                    userID:'...'
            }
          }
          The access token can be used to make requests to the Facebook APIs on behalf of that user. 
          The userID is the unique identifier for the user who's present in your app. */
          getUserInfoFromFB().then(function(info){
            userInfo = info;
            $http.post(baseUrl + '/authenticate', { userInfo: userInfo, fb: res, account: "facebook" })
              .success(function (data, status) {
                //Bij het inloggen met FB is het niet duidelijk of een gebruiker al bestond of niet ==> status 200 en 201 zijn ok
                if ((status === 200 || status === 201) && data.token) { 
                  $localStorage.token = data.token;
                  currentUser = PersonService.getPersonFromToken(data.token);
                  defer.resolve(currentUser);
                } else {
                  defer.reject();
                }
              })
              // Handle error
              .error(function (data) {
                defer.reject();
              });
          },
        function(error){
          //handle error
          console.error(error.type + ": " + error.message);
        });

        } else {
          /*
          The user is not logged to the app, or into Facebook:
          destroy the session on the server.
          */
          delete $localStorage.token;
          currentUser = {};
        }
        return defer.promise;
      }

      function logOutFacebook () {
        FB.logout(function(res){
          console.info("User logged out of Facebook:", res);
          statusChangeCallbackFacebook(res);
        });
      }

      // - Get user info from Facebook
      function getUserInfoFromFB () {
        var defer = $q.defer();
        FB.api('/me?fields=first_name,last_name,email,picture', function (res) {
          if (!res || res.error){
            defer.reject(res.error);
            console.error(res.error);
          } else {
            defer.resolve(res);
          }
        });
        return defer.promise;
      }

      // return available functions for use in the controllers
      return ({
        getCurrentUser: getCurrentUser,
        currentUser: currentUser,
        authenticate: authenticate,
        logout: logout,
        isLoggedIn: isLoggedIn,
        userIsReceiver: userIsReceiver,
        checkLoginStatus: checkLoginStatus,
        logInFacebook: logInFacebook,
        logOutFacebook: logOutFacebook
      });
  }]);
