angular.module('wishlist.wish', [
	'gimmi.models.wishlist',
	'gimmi.models.wish',
	'wishlist.wish.create',
	'wishlist.wish.edit',
])
	.config(function($stateProvider){

		$stateProvider
			.state('gimmi.wishlist.wish', {
				url: '/wish/:wishID',
				views: {
					'content@': {
						templateUrl: 'app/wishlist/wish/wish_info.tmpl.html',
						controller:'wishInfoCtrl as wishInfoCtrl',
						resolve: {
							wish: ['$stateParams', 'wishModel', function ($stateParams, wishModel){
									return wishModel.getWishById($stateParams.wishID);
								}]
						}
					}
				},
				authenticate: true
			})
		;
	})
	.controller('wishInfoCtrl', ['$stateParams', '$uibModal', '$state', 'wishModel', 'receiverModel', 'UserService', 'wish', function ($stateParams, $uibModal, $state, wishModel, receiverModel, UserService, wish){
		var _self = this;
		console.info("Wens geopend:", wish._id);
		_self.wish = wish;
		_self.reservedBy = angular.isDefined(_self.wish.reservation) ? _self.wish.reservation.reservedBy.fullName : "";
		_self.receiver = receiverModel.getCurrentReceiverName();
		_self.receiverID = wish.receiver;
		
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
						var originalWish = angular.copy(wish);
						return originalWish;
					}
				}
			});

			editDetailsPopup.result.then(function (wish) {
				//TODO: updateWish zou een promise moeten worden
				wishModel.updateWish(wish).then(function(wish){
					_self.wish = wish;
				});
				console.info("wish " + wish._id + "is updated");
			});
		}
		//TODO: Zou al in de DB call uit Mongo moeten meegegeven worden in het object
		_self.reservationStatus = function (wish) {
			var reservationStatus = "unreserved";
			if (wish.reservation && !wish.closure) {
				if (!isIncognitoReservation(wish)) {
					reservationStatus = "reserved";
				}
			} else if (wish.closure) {
				reservationStatus = "fulfilled";
			}
			return reservationStatus;
		}
		function isIncognitoReservation(wish) {
			var now = new Date();
			return (UserService.userIsReceiver(receiverModel.getCurrentReceiver()._id) && (!reservedByUser(wish.reservation.reservedBy)) && (wish.reservation.handoverDate > now.toISOString()));
		}
		_self.addReservation = function (wish, userID, reason) {
			/*var reservation = {
				reservator: userID,
				reason: reason
			};*/
			var wishReservationPopup = $uibModal.open({
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'wishReservation.html',
				size: 'md',
				controller: 'wishReservationPopupCtrl',
				controllerAs: 'wishReservationPopupCtrl',
				resolve: {
					wish: function () {
						return wish;
					},
					receiver: function () {
						return _self.receiver
					}
				}
			});

			wishReservationPopup.result.then(function (reservation) {
				reservation.reservationDate = new Date();
				reservation.reservedBy = userID;
				wishModel.addReservation(wish._id, reservation).then(function(wish){
					_self.wish = wish;
				});
			});
		};
		_self.deleteReservation = function (wish) {
			wishModel.deleteReservation(wish._id);
			delete _self.wish.reservation;
		};
		_self.copy = function (wish) {
			console.log("Wens kopiëren");
			var userID = UserService.getCurrentUser()._id;
			var newWish = {};
			newWish.title = wish.title;
			newWish.image = wish.image;
			newWish.url = wish.url;
			newWish.price = wish.price;

			wishModel.getCopies(userID)
				.then(function (results) {
					// Check if wish is already copied to list
					var copyExistsOnList = _.find(results, function (r) {
						return r.copyOf === wish._id;
					});

					(copyExistsOnList
						// If copy exists: open modal and return result (=promise)
						? $uibModal.open({
							ariaLabelledBy: 'modal-title',
							ariaDescribedBy: 'modal-body',
							templateUrl: 'copyWishWarning.html',
							size: 'md',
							controller: 'copyWarningPopupCtrl',
							controllerAs: 'copyWarningPopupCtrl',
							resolve: {
								wish: function () {
									return wish;
								}
							}
						}).result
						// If copy doesn't exist: immediately resolve a promise with the wish
						: Promise.resolve(wish))
						.then(function (wish) { // When promise resolves: create copy of wish
							wishModel.createWish(newWish, userID, userID, wish._id);
						}, function (err) { // When promise is rejected (modal is cancelled): log to console
							console.log("Copy is cancelled");
						});
				}, function (err) { // Log getCopies error to console
					console.log(err);
				});
		};
		_self.deleteWish = function deleteWishVerification(wish) {
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
				console.info(wish._id + " is verwijderd.");
				$state.go('gimmi.wishlist', { receiverID: _self.receiverID });
			});
		};
		_self.userIsReceiver = function (receiverID) {
			return UserService.userIsReceiver(receiverID);
		};

		_self.userIsCreator = function (creatorID) {
			return UserService.getCurrentUser()._id === creatorID;
		};

		_self.receiverIsCreator = function (creatorID, receiverID) {
			return creatorID === receiverID;
		}

		_self.reservedByUser = reservedByUser;
		
		function reservedByUser (reservatorID) {
			if (UserService.getCurrentUser()._id === reservatorID) {
				return true;
			} else {
				return false;
			}
		};
		_self.isIncognitoReservation = function (wish) {
			var now = new Date();
			return (UserService.userIsReceiver(receiverModel.getCurrentReceiver()._id) && (!reservedByUser(wish.reservation.reservedBy._id)) && (wish.reservation.handoverDate > now.toISOString()));
		}
		/* Feedback */
		_self.openFeedbackPopup = openFeedbackPopup;

		function openFeedbackPopup(wish) {
			var giftFeedbackPopup = $uibModal.open({
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'app/wishlist/giftFeedbackPopup.tmpl.html',
				controller: 'giftFeedbackPopupController',
				controllerAs: 'giftFeedbackPopupCtrl',
				resolve: {
					wish: function () {
						return wish;
					}
				}
			});
			giftFeedbackPopup.result.then(function (giftFeedback) {
				//wishID, feedback-object needed for call
				wishModel.addFeedback(wish._id, giftFeedback).then(function (wish) {
					var closureInfo = {
						closedBy: UserService.getCurrentUser()._id,
						reason: "Cadeau ontvangen"
					};
					wishModel.close(wish._id, closureInfo).then(function (wish) {
						console.log(`Wish ${wish._id} is closed`)
					});
					if (giftFeedback.putBackOnList) {
						_self.copy(wish);
					}
				});
			});
		}

	}])
	.controller('wishDetailsEditCtrl', ['$window', '$uibModalInstance', 'wish', 'cloudinaryService', function ($window, $uibModalInstance, wish, cloudinaryService){
		var _self = this;
		var currentImage = wish.image;
		_self.wish = wish;
		_self.ok = function () {
			if (_self.wish.image !== currentImage) {
				cloudinaryService.renameImage(_self.wish.image.public_id, _self.wish._id, function (image) {
					wish.image = image;
					$uibModalInstance.close(wish);
				});
			} else {
				$uibModalInstance.close(wish);
			}
		};
		_self.cancel = function () {
			if (_self.wish.image !== currentImage) {
				cloudinaryService.deleteImage(_self.wish.image.public_id, function() {
					$uibModalInstance.dismiss('cancel');
				});
			} else {
				$uibModalInstance.dismiss('cancel');
			}
		};
		_self.goToTitle = function() {
			$window.document.getElementById('DetailWishTitle').focus();
		}
	}])
;
