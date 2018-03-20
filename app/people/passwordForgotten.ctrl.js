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
                }
            })
            .state('gimmi.resetpassword', {
                url: 'resetPassword/:token',
                views: {
                    'content@': {
                        templateUrl: '/app/people/resetPassword.tmpl.html',
                        controller: 'resetPasswordCtrl as resetPasswordCtrl'
                    }
                },
                resolve: {
                    validToken: ['$stateParams', 'PersonService', function ($stateParams, PersonService) {
                        return PersonService.validatePasswordResetToken($stateParams.token)
                            .then(function(token){
                                return true;
                            }, function(error){
                                return false;
                            });
                    }]
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
    }])
    .controller('resetPasswordCtrl', ['$state', '$stateParams', '$rootScope', 'Flash', 'PersonService', 'validToken', function ($state, $stateParams, $rootScope, Flash, PersonService, validToken) {
        var _self = this;
        _self.token = $stateParams.token;
        _self.validToken = validToken;
        _self.password = "";
        _self.passwordRepeat = "";
        _self.sendNewPassword = function () {
            PersonService.resetPassword(_self.token, _self.password)
                .then(function (person) {
                    console.info("Password changed for " + person._id);
                    _self.password = _self.passwordRepeat = "";
                    Flash.create('success', "Uw paswoord werd aangepast. U kan nu inloggen met uw nieuwe paswoord.");
                    $rootScope.attemptedEmail = person.email;
                    $state.go('gimmi.login');
                });
        }
    }])
    ;