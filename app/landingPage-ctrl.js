angular.module('landingPage', [])
    .controller('landingPageCtrl', ['$state', function ($state){
        var self = this;
        self.toRegistration = function(){
            $state.go('gimmi.register_person');
        };
        self.toWishlist = function(userID){
            $state.go('gimmi.wishlist', {receiverID: userID});
        };
        self.sendWishlist = function (userID) {
            $state.go('gimmi.wishlist.send', { receiverID: userID });
        };
        self.toUserDashboard = function (userID) {
            $state.go('gimmi.userdashboard', { userID: userID });
        };
    }]);