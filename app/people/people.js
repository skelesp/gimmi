angular.module('gimmi.person')
    .config(['$stateProvider', function($stateProvider){
        $stateProvider
            .state('gimmi.person', {
                url: 'person/:personID',
                views: {
                    'content@': {
                        template: '<h1>User management</h1>',
                        controller: 'personCtrl as personCtrl'
                    }
                }
            })
    }])
    .controller('personCtrl', function () {
        console.log("hi there user");
    })
;