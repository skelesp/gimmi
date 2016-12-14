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
		var self = this;

		self.userIsReceiver = UserService.userIsReceiver();

		self.userIsCreator = function(creatorID){
			if (UserService.getCurrentUser()._id === creatorID) {
				return true;
			} else {
				return false;
			}
		};

		self.reservedByUser = function(reservatorID){
			if (UserService.getCurrentUser()._id === reservatorID) {
				return true;
			} else {
				return false;
			}
		}

		self.deleteWish = wishModel.deleteWish;
		self.reserve = wishModel.reserve;
		self.setFree = wishModel.setFree;
	})

;
