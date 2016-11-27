angular.module('wishlist', [
	'gimmi.models.wishlist',
	'gimmi.models.person',
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
;
