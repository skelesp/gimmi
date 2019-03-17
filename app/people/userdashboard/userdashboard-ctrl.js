angular.module('userdashboard', [
    
])
.config(['$stateProvider', function ($stateProvider){
    $stateProvider.state('gimmi.userdashboard', {
        url: 'user/:userID',
        views: {
            'content@': {
                templateUrl: 'app/people/userdashboard/userdashboard.tmpl.html',
                controller: 'userDashboardController as userDashboardCtrl'
            }
        },
        resolve: {
            user: ['PersonService', '$stateParams', function (PersonService, $stateParams){
                return PersonService.getPersonFromID($stateParams.userID)
            }]
        }
    });
}])
    .controller('userDashboardController', ['user', function (user) {
    var self = this;
    self.user = user;
}]);