angular.module('wishlist.wish', [
	'gimmi.models.wishlist',
	'gimmi.models.wish',
	'wishlist.wish.create',
	'wishlist.wish.edit'
])
	.config(function($stateProvider){

		$stateProvider
			.state('gimmi.wishlist.wish', {
				url: 'wishlist/:receiverID',
				views: {
					'wishes@': {
						templateUrl: 'app/wishlist/wish/wish.tmpl.html',
						controller:'wishCtrl as wishCtrl'
					}
				}
			})
		;
	})

	.controller('wishCtrl', function($stateParams, wishModel, receiverModel) {
		var wishCtrl = this;

		receiverModel.setCurrentReceiver($stateParams.receiverID);

		wishModel.getWishes()
			.then(function(wishes) {
				wishCtrl.wishes = wishes;
			});

			wishCtrl.getCurrentReceiver = receiverModel.getCurrentReceiver;
			wishCtrl.getCurrentReceiverName = receiverModel.getCurrentReceiverName;
			wishCtrl.getCurrentReceiverId = receiverModel.getCurrentReceiverId;
			wishCtrl.deleteWish = wishModel.deleteWish;
			wishCtrl.reserve = wishModel.reserve;
			wishCtrl.setFree = wishModel.setFree;
	})

;
