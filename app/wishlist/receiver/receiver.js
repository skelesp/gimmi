angular.module('wishlist.receiver', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver',
	'wishlist.receiver.create',
	'wishlist.receiver.edit'
])
	.controller('receiverCtrl', function(receiverModel) {
		var receiverCtrl = this;

		receiverModel.getReceivers()
			.then(function(receivers) {
				receiverCtrl.receivers = receivers;
			});
	})
;
