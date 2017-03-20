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

	.controller('wishCtrl', function($stateParams, $uibModal, wishModel, receiverModel, UserService) {
		var _self = this;
		_self.userIsReceiver = function(receiverID) {
			return UserService.userIsReceiver(receiverID);
		};

		_self.userIsCreator = function(creatorID){
			if (UserService.getCurrentUser()._id === creatorID) {
				return true;
			} else {
				return false;
			}
		};

		_self.reservedByUser = function(reservatorID){
			if (UserService.getCurrentUser()._id === reservatorID) {
				return true;
			} else {
				return false;
			}
		};

		function edit(wish){
			console.info("Wish in edit mode");
			var editPopup = $uibModal.open({
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'editWish.html',
				size: 'sm',
				controller: 'editPopupCtrl',
				controllerAs: 'editPopupCtrl',
				resolve: {
					wish: function () {
						return wish;
					}
				}
			});

			editPopup.result.then(function(wish) {
				wishModel.updateWish(wish);
				console.info(wish.title + " is gewijzigd.");
			});
		}

		function deleteWishVerification (wish) {
			console.info("deleteWish started");
			//Create a popup instance for delete verification
			var deletePopup = $uibModal.open({
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'deleteVerification.html',
				size: 'md',
				controller: 'deletePopupCtrl',
				controllerAs: 'deletePopupCtrl',
				resolve: {
					wish: function () {
						return wish;
					}
				}
			});

			deletePopup.result.then(function (wish) {
				wishModel.deleteWish(wish);
				console.info(wish.title + " is verwijderd.")
			});
		}
		_self.edit = edit;
		_self.deleteWish = deleteWishVerification;
		_self.reserve = wishModel.reserve;
		_self.setFree = wishModel.setFree;
	}
)
.controller('editPopupCtrl', function($uibModalInstance, wish) {
	var _self = this;
	if (!wish.image){
		wish.image="layout/avonmore_shop_test/images/wish_item_bg.png";
	}
	_self.wish = wish;
	_self.ok = function () {
		$uibModalInstance.close(wish);
	};
	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
})
.controller('deletePopupCtrl', function ($uibModalInstance, wish){
	var _self = this;
	_self.wishTitle = wish.title;
	_self.ok = function () {
		$uibModalInstance.close(wish);
	};

	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
})
;
