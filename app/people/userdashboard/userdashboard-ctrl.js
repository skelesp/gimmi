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
    var openCount = 0; var reservedCount = 0; var receivedCount = 0; var closedCount = 0;
    wishlist.wishes.forEach(wish => {
        switch (wish.state) {
            case "Open":
                openCount++;
                break;
            case "Reserved":
                reservedCount++;
                break;
            case "Received":
                receivedCount++;
                break;
            case "Closed":
                closedCount++;
                break;
        }
    });
    self.counts = {
        openWishCount : openCount,
        reservedWishCount : reservedCount,
        receivedWishCount : receivedCount,
        closedWishCount : closedCount
    }
    
    self.user = user;
   
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