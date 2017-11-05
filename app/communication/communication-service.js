(function() {
'use strict';

angular.module('gimmi.communication', [
    'gimmi.config'
])
    .factory('CommunicationService', ['$q', '$http', 'CONFIG', function ($q, $http, CONFIG) {
        return ({
            sendMail: function (to, subject, text, html) {
                var deferred = $q.defer();
                var mailInfo = {
                    to: to,
                    subject: subject,
                    text: text,
                    html: html
                };
                $http.post(CONFIG.apiUrl + '/api/email', mailInfo)
                    .success(function(response){
                        deferred.resolve(response);
                    })
                    .error(function(data){
                        deferred.reject(data.error);
                    });
                return deferred.promise;
            }
        });
    }]);
})();

/* Send mail in controllers
CommunicationService.sendMail("stijn.beeckmans@gmail.com", "Test mail vanuit Angular", "Text", "<h1>HTML</h1>")
    .then(function (data) {
        console.log("Email sent: %s", data)
    }); 
*/