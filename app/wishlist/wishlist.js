angular.module('wishlist', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver',
	'wishlist.receiver',
	'gimmi.config',
	'gimmi.authentication'
])
	.config(function($stateProvider){
		$stateProvider
			.state('gimmi.wishlist', {
				url: 'wishlist/:receiverID',
				views: {
					'content@': {
						templateUrl: 'app/wishlist/wishlist.tmpl.html',
						controller:'wishlistCtrl as wishlistCtrl',
						resolve: {
								currentReceiver: ['$stateParams', 'receiverModel', function($stateParams, receiverModel){
									return receiverModel.setCurrentReceiver($stateParams.receiverID);
								}]
						}
					},
					'wishlist_item@gimmi.wishlist': {
						templateUrl: 'app/wishlist/wishlist_item.tmpl.html',
						controller: 'wishCtrl as wishCtrl'
					},
					'wish_create@gimmi.wishlist': {
						templateUrl: 'app/wishlist/wish/create/wish-create.tmpl.html',
						controller: 'createWishCtrl as createWishCtrl'
					}
				}
			})
			.state('gimmi.wishlist.send',{
				url: '/send',
				views:{
					'content@': {
						templateUrl: 'app/wishlist/sendWishlist.tmpl.html',
						controller: 'sendWishlistController as sendWishlistCtrl'
					}
				}
			})
		;
	})

	.controller('wishlistCtrl', ['$stateParams', 'wishModel', 'receiverModel', 'UserService',
					function wishlistCtrl($stateParams, wishModel, receiverModel, UserService){
		var wishlistCtrl = this;

		var currentReceiver = receiverModel.getCurrentReceiver();
		wishlistCtrl.currentReceiver = currentReceiver;
		wishlistCtrl.userIsReceiver = UserService.userIsReceiver();
		
		//TODO: get wishes for this receiver
		wishModel.getWishes().then(function(wishes) {
			wishlistCtrl.wishes = wishes;
		});
	}])

	.controller('createWishCtrl', ['$state', '$stateParams', 'wishModel', 'receiverModel', 'UserService',
												function($state, $stateParams, wishModel, receiverModel, UserService){
    var createWishCtrl = this;

    function returnToWishes(){
      $state.go('gimmi.wishlist', {
        receiverID: $stateParams.receiverID
      })
    }

    function createWish(wish, receiverID, userID) {
			console.log(wish);
      wishModel.createWish(wish, receiverID, userID);
      returnToWishes();
    }

    function resetForm() {
      createWishCtrl.newWish = {
        title: '',
        price: ''
      }
    }

    createWishCtrl.reset = resetForm;
    createWishCtrl.createWish = createWish;

    createWishCtrl.currentReceiverID = receiverModel.getCurrentReceiver()._id;
    createWishCtrl.currentUserID = UserService.getCurrentUser()._id;

    resetForm();

  }])
	.controller('sendWishlistController', ['$stateParams', 'CONFIG', function($stateParams, CONFIG){
		var self = this;

		self.url = CONFIG.siteBaseUrl + "/#/wishlist/" + $stateParams.receiverID;
	}])
;
