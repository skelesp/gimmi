angular.module('wishlist.receiver', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver',
	'wishlist.receiver.create',
	'wishlist.receiver.edit'
])
	.controller('receiverCtrl', function($scope, $state, receiverModel) {
		var receiverCtrl = this;

		receiverModel.getReceivers()
			.then(function(receivers) {
				receiverCtrl.receivers = receivers;
			});

		receiverCtrl.showWishlist = function(keyEvent, name) {
		  if (keyEvent.which === 13){
				var text = name;

				text = text.charAt(0).toUpperCase() + text.slice(1);
				$state.go('gimmi.wishlist.wish',{receiverName: text});
				$scope.selected = null;
			}
		};
	})
;
