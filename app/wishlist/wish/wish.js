angular.module('wishlist.wish', [
	'gimmi.models.wishlist',
	'gimmi.models.wish',
	'wishlist.wish.create',
	'wishlist.wish.edit'
])
	.config(function($stateProvider){

		$stateProvider
			.state('gimmi.wishlist.wish', {
				url: 'wish/:wishID',
				views: {
					'wish@': {
						templateUrl: 'app/wishlist/wish/wish_info.tmpl.html',
						controller:'wishCtrl as wishCtrl'
					}
				}
			})
		;
	})

	.controller('wishCtrl', function($stateParams, wishModel, receiverModel, UserService) {
		var wishCtrl = this;

		wishCtrl.userIsReceiver = function(){
			console.log("Receiver:",receiverModel.getCurrentReceiver());
			console.log("User:", UserService.getCurrentUser());
			if (receiverModel.getCurrentReceiver()._id === UserService.getCurrentUser()._id) {
				return true;
			} else {
				return false;
			}
		};

		wishCtrl.deleteWish = wishModel.deleteWish;
		wishCtrl.reserve = wishModel.reserve;
		wishCtrl.setFree = wishModel.setFree;
	})

;
