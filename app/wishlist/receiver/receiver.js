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

		receiverCtrl.showWishlist = function(keyEvent, selected) {
		  if (keyEvent.which === 13){
				console.log(selected);

				receiverModel.getReceiverByName(selected.name)
					.then(function(receiver){
						$state.go('gimmi.wishlist',{receiverID: receiver.id});
					});
				$scope.selected = null;
			}
		};

	})
;
