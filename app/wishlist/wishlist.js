angular.module('wishlist', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver',
	'wishlist.receiver'
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
		;
	})

	.controller('wishlistCtrl', function wishlistCtrl($stateParams, wishModel, receiverModel){
		var wishlistCtrl = this;

		//TODO: get wishes for this receiver
		wishModel.getWishes()
			.then(function(wishes) {
				wishlistCtrl.wishes = wishes;
			});
			var currentReceiver = receiverModel.getCurrentReceiver();
			currentReceiver.fullName = currentReceiver.firstName + " " + currentReceiver.lastName
			wishlistCtrl.currentReceiver = currentReceiver;
	})

	.controller('createWishCtrl', function($state, $stateParams, wishModel, receiverModel, UserService){
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

  })
;
