(function() {
'use strict';

angular.module('gimmi.communication', [
    'gimmi.config'
])
    .factory('CommunicationService', ['$q', '$http', 'CONFIG', function ($q, $http, CONFIG) {
        return ({
            sendMail: function (mail) {
                var deferred = $q.defer();
                var mailInfo = {
                    to: mail.to,
                    subject: mail.subject,
                    html: mail.html
                };
                $http.post(CONFIG.apiUrl + '/api/email', mailInfo)
                    .success(function(response){
                        deferred.resolve(response);
                    })
                    .error(function(data){
                        console.error("Server error: ", data.error);
                        console.log(data.message);
                        deferred.reject(data.message);
                    });
                return deferred.promise;
            }
        });
    }]);
})();