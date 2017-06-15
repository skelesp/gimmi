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
	.controller('wishInfoCtrl', ['$stateParams', '$uibModal', 'wishModel', 'receiverModel', function ($stateParams, $uibModal, wishModel, receiverModel){
			var _self = this;

			wishModel.getWishById($stateParams.wishID).then( function(wish){
				_self.wish = wish;
				if (wish.reservation) {
					_self.reservedBy = wish.reservation.reservedBy.fullName;
				}
				_self.createdBy = wish.createdBy.fullName;
				_self.createdAt = wish.createdAt;
				_self.receiver = receiverModel.getCurrentReceiverName();
				_self.receiverID = wish.receiver;
			});

			_self.editWishDetails = function(wish){
				//Create a popup instance for wish details edit
				var editDetailsPopup = $uibModal.open({
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'app/wishlist/wish/wish_detail_edit-modal.html',
					size: 'lg',
					controller: 'wishDetailsEditCtrl',
					controllerAs: 'wishDetailsEditCtrl',
					resolve: {
						wish: function () {
							return wish;
						}
					}
				});

				editDetailsPopup.result.then(function (wish) {
					wishModel.updateWish(wish);
					console.log("wish is updated");
				});
			}
	}])
	.controller('wishDetailsEditCtrl', ['$uibModalInstance', 'wish', function($uibModalInstance, wish){
		var _self = this,
		originalKeys = Object.keys(wish);

		_self.wish = wish;
		_self.ok = function () {
			$uibModalInstance.close(wish);
		};
		_self.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}])
;
