angular.module('gimmi.person')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('gimmi.forgotpassword', {
                url: 'forgotpassword',
                views: {
                    'content@': {
                        templateUrl: '/app/people/passwordForgotten.tmpl.html',
                        controller: 'forgottenPasswordCtrl as forgottenPasswordCtrl'
                    }
                },
                resolve: {
                }
            })
    }])
    .controller('forgottenPasswordCtrl', ['$rootScope', 'Flash', 'PersonService', function ($rootScope, Flash, PersonService) {
        var _self = this;

        _self.email = $rootScope.attemptedEmail ? $rootScope.attemptedEmail : "";
        _self.requestReset = function(){
            PersonService.requestPasswordReset(_self.email)
                .then(function(){
                    Flash.create("success", "Er is een email verzonden naar uw emailadres. Gelieve op de link in de mail te klikken.");
                    _self.requestDone = true;
                }, function(error){
                    console.error(error);
                    Flash.create("success", "Er is een email verzonden naar uw emailadres. Gelieve op de link in de mail te klikken.");
                    _self.requestDone = true;
                })
            ;
        }
    }]);