angular.module('wishlist', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver'
])
	.config(function($stateProvider){
		$stateProvider
			.state('gimmi.wishlist', {
				url: 'wishlist/:receiverID',
				views: {
					'content@': {
						templateUrl: 'app/wishlist/wishlist.tmpl.html',
						controller:'wishlistCtrl as wishlistCtrl'
					},
					'wishlist_item@gimmi.wishlist': {
						templateUrl: 'app/wishlist/wishlist_item.tmpl.html',
						controller: 'wishCtrl as wishCtrl'
					}
				}
			})
		;
	})

	.controller('wishlistCtrl', function wishlistCtrl($stateParams, wishModel, receiverModel){
		var wishlistCtrl = this;

		receiverModel.setCurrentReceiver($stateParams.receiverID);

		wishModel.getWishes()
			.then(function(wishes) {
				wishlistCtrl.wishes = wishes;
			});

			wishlistCtrl.getCurrentReceiver = receiverModel.getCurrentReceiver;
			wishlistCtrl.getCurrentReceiverName = receiverModel.getCurrentReceiverName;
			wishlistCtrl.getCurrentReceiverId = receiverModel.getCurrentReceiverId;
	})
;
