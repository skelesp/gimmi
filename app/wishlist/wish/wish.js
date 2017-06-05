angular.module('wishlist.wish', [
	'gimmi.models.wishlist',
	'gimmi.models.wish',
	'wishlist.wish.create',
	'wishlist.wish.edit'
])
	.config(function($stateProvider){

		$stateProvider
			.state('gimmi.wishlist.wish', {
				url: '/wish/:wishID',
				views: {
					'content@': {
						templateUrl: 'app/wishlist/wish/wish_info.tmpl.html',
						controller:'wishInfoCtrl as wishInfoCtrl'
					}
				}
			})
		;
	})
	.controller('wishInfoCtrl', ['$stateParams', 'wishModel', 'receiverModel', function ($stateParams, wishModel, receiverModel){
			var _self = this;

			wishModel.getWishById($stateParams.wishID).then( function(wish){
				_self.title = wish.title;
				_self.price = wish.price;
				_self.url = wish.url;
				_self.image = wish.image;
				if (wish.reservation) {
					_self.reservedBy = wish.reservation.reservedBy.fullName;
				}
				_self.createdBy = wish.createdBy.fullName;
				_self.createdAt = wish.createdAt;
				_self.receiver = receiverModel.getCurrentReceiverName();
				_self.receiverID = wish.receiver;
			});
	}])
;
