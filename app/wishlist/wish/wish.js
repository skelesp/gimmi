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

		function deleteWishVerification (wish) {
			console.info("deleteWish started");
			//Create a popup instance for delete verification
			var deletePopup = $uibModal.open({
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'deleteVerification.html',
				size: 'sm',
				controller: 'deletePopupCtrl',
				controllerAs: 'deletePopupCtrl',
				resolve: {
					wish: function () {
						return wish;
					}
				}
			});

			//TODO: wishModel.deleteWish toevoegen
			deletePopup.result.then(function (wish) {
				wishModel.deleteWish(wish);
				console.info(wish.title + " is verwijderd.")
			});
		}

		_self.deleteWish = deleteWishVerification;
		_self.reserve = wishModel.reserve;
		_self.setFree = wishModel.setFree;
	}
)
.controller('deletePopupCtrl', function ($uibModalInstance, wish){
	var _self = this;
	_self.wishTitle = wish.title;
	console.log (wish);
	_self.ok = function () {
		$uibModalInstance.close(wish);
	};

	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
})
;
