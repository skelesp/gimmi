angular.module('gimmi.person', [
  'gimmi.config'
])
  .factory('PersonService',
    ['$q', '$http', '$injector', 'Flash', 'CONFIG',
    function ($q, $http, $injector, Flash, CONFIG) {

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
      // - Get person from ID
      function getPersonFromID(id) {
        var deferred = $q.defer();
        if (id) {
          $http.get(CONFIG.apiUrl + '/api/people/' + id)
            .success(function (person) {
              if (person) {
                deferred.resolve(person);
              } else {
                deferred.reject("Person not found.");
              }
            })
            .error(function (data) {
              deferred.reject(data.error);
            });
        } else {
          deferred.reject("No id provided");
        }

        return deferred.promise;
      }
      function findByEmail(email) {
        var person = {};
        var deferred = $q.defer();
        if (email) {
          $http.get(CONFIG.apiUrl + '/api/people/email/' + email)
            .success(function(person){
              deferred.resolve(person);
            })
            .error(function(data){
              deferred.reject("No email found");
            });
        } else {
          deferred.reject("No email provided");
        }
        return deferred.promise;
      }
      // - Register a person to the server -
      function register(person) {
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
      }
      function getNameById(id) {
        var person = {};
        var deferred = $q.defer();
        if (id) {
          $http.get(CONFIG.apiUrl + '/api/people/' + id + '/name')
            .success(function (person) {
              deferred.resolve(person);
            })
            .error(function (data) {
              deferred.reject("No person found");
            });
        } else {
          deferred.reject("No id provided");
        }
        return deferred.promise;
      }
      function getEmailById (id) {
        var deferred = $q.defer();
        if (id) {
          $http.get(CONFIG.apiUrl + '/api/people/' + id + '/email')
            .success(function (email) {
              deferred.resolve(email);
            })
            .error(function (data) {
              deferred.reject("No person found", data);
            });
        } else {
          deferred.reject("No id provided");
        }
        return deferred.promise;
      }
      function updatePersonDetails (person){
        var deferred = $q.defer();
        if (person) {
          $http.put(CONFIG.apiUrl + '/api/people/' + person._id, person)
            .success(function(person){
              person.birthday = new Date(person.birthday);
              $injector.get('UserService').refreshCurrentUser("person", person);
              $injector.get('receiverModel').refreshReceivers()
                .then(function (receivers) {
                  deferred.resolve(person);
                });
            })
            .error(function(error){
              deferred.reject({error: "something went wrong"});
            });
        } else {
          deferred.reject({error: "No person object found"});
        }
        return deferred.promise;
      }
      function requestPasswordReset (email){
        var deferred = $q.defer();
        if (email) {
        var body = {
            "email": email,
            "source": CONFIG.siteBaseUrl
          };

          $http({
            method: 'DELETE',
            url: CONFIG.apiUrl + '/api/people/account/local',
            data: body,
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
          })
            .success(function(token){
              deferred.resolve();
            })
            .error(function(err){
              deferred.reject({error: "Password reset could not be executed."})
            })
        } else {
          deferred.reject({ error: "No email provided for password reset" })
        }
        return deferred.promise;
      }
      function validatePasswordResetToken (token){
        var deferred = $q.defer();

        if (token) {
          $http.get(CONFIG.apiUrl + '/api/people/account/local/' + token)
            .success( function (tokenInfo) {
              deferred.resolve(tokenInfo);
            })
            .error( function(error){
              deferred.reject(error);
            })
          ;
        } else {
          deferred.reject({error: "No token provided"});
        }
        return deferred.promise;
      }
      function resetPassword (token, pw) {
        var deferred = $q.defer();

        if (token && pw) {
          $http.put(CONFIG.apiUrl + '/api/people/account/local/' + token, {pw: pw})
            .success(function (person) {
              deferred.resolve(person);
            })
            .error(function (error) {
              deferred.reject(error);
            })
            ;
        } else {
          deferred.reject({ error: "No token or password provided" });
        }
        return deferred.promise;
      }
      function updatePassword (person, pw){
        var deferred = $q.defer();
        
        if (pw) {
          var body = {
            pw: pw
          }
          $http.put(CONFIG.apiUrl + '/api/people/' + person._id + '/account/local', body)
          .success(function(person){
            console.log("Het lokale wachtwoord werd gewijzigd voor " + person._id);
            Flash.create('success', "Het paswoord voor je Gimmi-account is bijgewerkt.");
            // Send email on password change
            deferred.resolve(person);
          })
          .error(function(error){

          });
        } else {
          deferred.reject("Er is geen wachtwoord ingegeven.");
        }

        return deferred.promise;
      }
      function updateExtraInfo(personId, likes, dislikes) {
        var deferred = $q.defer();
        if (personId) {
          $http.put(`${CONFIG.apiUrl}/api/people/${personId}/extrainfo`, {likes, dislikes})
            .success(function (person) {
              deferred.resolve(person);
            })
            .error(function (error) {
              deferred.reject({ error: "something went wrong" });
            });
        } else {
          deferred.reject({ error: "No person object found" });
        }
        return deferred.promise;
      }
      function deleteFacebookAccount (person){
        $http.delete(CONFIG.apiUrl + '/api/people/' + person._id + '/account/facebook')
        .success(function(token){
          console.log("Facebook account verwijder voor " + person._id);
          Flash.create('success', "Je Facebook-account is ontkoppeld. Als je een lokale Gimmi account hebt, zal je onder die account ingelogd blijven. Anders word je uitgelogd.");
          $injector.get('UserService').logOutFacebook();
          $injector.get('UserService').refreshCurrentUser("token", token);
        })
      }
      // - return available functions for use in the controllers -
      return ({
        register: register,
        getPersonFromToken: getPersonFromToken,
        getPersonFromID: getPersonFromID,
        getNameById: getNameById,
        findByEmail: findByEmail,
        updatePersonDetails: updatePersonDetails,
        updatePassword: updatePassword,
        requestPasswordReset: requestPasswordReset,
        validatePasswordResetToken: validatePasswordResetToken,
        resetPassword: resetPassword,
        deleteFacebookAccount: deleteFacebookAccount,
        updateExtraInfo: updateExtraInfo,
        getEmailById: getEmailById
      });
    }]);
