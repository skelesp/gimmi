angular.module('wishlist', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver'
])
	.config(function($stateProvider){
		$stateProvider
			.state('gimmi.wishlist', {
				url: '/',
				views: {
					'wishlists@': {
						controller: 'wishlistCtrl as wishlistCtrl',
						templateUrl: 'app/wishlist/wishlist.tmpl.html'
					}
					,'receiverSearch@': {
						controller: 'receiverCtrl as receiverCtrl',
						templateUrl: 'app/wishlist/receiver/receiverSearch.tmpl.html'
					}
				}
			})
		;
	})

	.controller('wishlistCtrl', function wishlistCtrl(receiverModel){
		var wishlistCtrl = this;

		receiverModel.getReceivers()
			.then(function(receivers) {
				wishlistCtrl.receivers = receivers;
			});
	})
;
