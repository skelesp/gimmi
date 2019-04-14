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
            }],
            wishlist: ['wishModel', '$stateParams', function(wishModel, $stateParams){
                return wishModel.getWishlist($stateParams.userID);
            }]
        }
    });
}])
    .controller('userDashboardController', ['$state', 'Flash', 'user', 'wishlist', function ($state, Flash, user, wishlist) {
    var self = this;
    self.user = user;
    self.wishCount = function() {
        var count = 0;
        wishlist.wishes.forEach(wish => {
            if (!wish.closure) {
                count++;
            }
        });
        return count;
    }
    self.toWishlist = function () {
        $state.go('gimmi.wishlist', { receiverID: self.user._id });
    };
    self.toReservationManagement = function () {
        showNotSupportedMessage();
    };
    self.startNewGiftSearch = function () {
        showNotSupportedMessage();
    };
    self.addWish = function () {
        showNotSupportedMessage();
    };
    self.toUserDashboard = function () {
        $state.go('gimmi.userdashboard', { userID: self.user._id });
    };
    function showNotSupportedMessage(){
        Flash.create('danger', 'Deze functie wordt nog niet ondersteund.');
    };
}]);