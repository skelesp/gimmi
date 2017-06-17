angular.module('wishlist', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver',
	'wishlist.receiver',
	'gimmi.config',
	'gimmi.authentication',
	'wishlist.wish',
	'search'
])
	.config(function($stateProvider){
		$stateProvider
			.state('gimmi.wishlist', {
				url: 'wishlist/:receiverID',
				views: {
					'content@': {
						templateUrl: 'app/wishlist/wishlist.tmpl.html',
						controller:'wishlistCtrl as wishlistCtrl',
						resolve: {
								currentReceiver: ['$stateParams', 'receiverModel', function($stateParams, receiverModel){
									return receiverModel.setCurrentReceiver($stateParams.receiverID);
								}]
						}
					},
					'wishlist_item@gimmi.wishlist': {
						templateUrl: 'app/wishlist/wishlist_item.tmpl.html',
						controller: 'wishCtrl as wishCtrl'
					},
					'wish_create@gimmi.wishlist': {
						templateUrl: 'app/wishlist/wish/create/wish-create.tmpl.html',
						controller: 'createWishCtrl as createWishCtrl'
					}
				}
			})
			.state('gimmi.wishlist.send',{
				url: '/send',
				views:{
					'content@': {
						templateUrl: 'app/wishlist/sendWishlist.tmpl.html',
						controller: 'sendWishlistController as sendWishlistCtrl'
					}
				}
			})
		;
	})
	.controller('wishlistCtrl', ['$stateParams', 'wishModel', 'receiverModel', 'UserService',
					function wishlistCtrl($stateParams, wishModel, receiverModel, UserService){
		var wishlistCtrl = this;

		var currentReceiver = receiverModel.getCurrentReceiver();
		wishlistCtrl.currentUserID = UserService.getCurrentUser().id;
		wishlistCtrl.currentReceiver = currentReceiver;
		if (currentReceiver) {
				wishModel.getWishlist(wishlistCtrl.currentReceiver._id).then(function(wishlist) {
					wishlistCtrl.wishes = wishlist.wishes;
				});
				wishlistCtrl.userIsReceiver = UserService.userIsReceiver(wishlistCtrl.currentReceiver._id);
		} else {
			wishlistCtrl.userIsReceiver = false;
		}
	}])
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

		function copy(wish){
			var userID = UserService.getCurrentUser()._id;
			var newWish = {};
			newWish.title = wish.title;
			newWish.image = wish.image;
			newWish.url = wish.url;
			newWish.price =  wish.price;
			wishModel.createWish(newWish, userID, userID);
		}

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
				console.info(wish._id + " is verwijderd.")
			});
		}

		function addReservation (wish, userID, reason) {
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
					}
				}
			});

			wishReservationPopup.result.then(function(reservation) {
				reservation.reservationDate = new Date();
				reservation.reservedBy = userID;

				wishModel.addReservation(wish._id, reservation);
			});
		}

		function deleteReservation (wish) {
				wishModel.deleteReservation(wish._id);
		}
		//TODO: Zou al in de DB call uit Mongo moeten meegegeven worden in het object
		function getReservationStatus (wish) {
			var reservationStatus = "unreserved";
			if (wish.reservation) {
				reservationStatus = "reserved";
			}
			return reservationStatus;
		}
		_self.reservationStatus = getReservationStatus;
		_self.copy = copy;
		_self.edit = edit;
		_self.deleteWish = deleteWishVerification;
		_self.addReservation = addReservation;
		_self.deleteReservation = deleteReservation;
	}
)
.controller('editPopupCtrl', function($uibModalInstance, wish) {
	var _self = this;

	_self.wish = wish;
	_self.ok = function () {
		$uibModalInstance.close(wish);
	};
	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
})
.controller('wishReservationPopupCtrl', function($uibModalInstance, wish) {
	var _self = this;
	var reservation = {amount: 1, reason: ''};
	_self.reservation = reservation;
	_self.wishTitle = wish.title;
	_self.ok = function () {

		$uibModalInstance.close(reservation);
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
	.controller('createWishCtrl', ['$state', '$stateParams', '$uibModal', 'wishModel', 'receiverModel', 'UserService', 'SearchService',
												function($state, $stateParams, $uibModal, wishModel, receiverModel, UserService, SearchService){
    var _self = this;
		_self.newWish = {
			title: '',
			price: '',
			url: '',
			image: ''
		};
		_self.noImages = true;

    function returnToWishes(){
      $state.go('gimmi.wishlist', {receiverID: $stateParams.receiverID })
    }

    function createWish(wish, receiverID, userID) {
			if (!wish.image) {
				wish.image = '';
			}
      wishModel.createWish(wish, receiverID, userID);
			resetForm();
      returnToWishes();
    }

    function resetForm() {
      _self.newWish = {
        title: '',
        price: '',
				url: '',
				image: ''
      }
			_self.googleImages = [];
    }

		function searchImagesOnGoogle(searchTerm) {
			_self.googleImages = [];
			searchTerm = searchTerm.trim();

			if (searchTerm){ //SearchTerm has been entered
				SearchService.getSearchResults(searchTerm)
					.then(function (results) {
						if (results.data) { //images found, save all the links
							console.info("Images gevonden.")
							_self.noImages = false;
							var searchResults = results.data;
							searchResults.forEach(function(item){
								if (item.link) {
									_self.googleImages.push(item.link);
								}
							});
						}
						else { //No images found, show default image
							console.error("Geen images gevonden.")
							_self.noImages = true;
							_self.googleImages.push("https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTaO2OnPKQ3_p3RdI1KZkj6XP-8il5iRO9iGj9Xj8TT0KuKTE_Ynw")
						}

						//Create a popup instance for gcse images
						var imagePopup = $uibModal.open({
				      ariaLabelledBy: 'modal-title',
				      ariaDescribedBy: 'modal-body',
				      templateUrl: 'googleImageSearchResults.html',
							size: 'lg',
				      controller: 'imagePopupCtrl',
				      controllerAs: 'imagePopupCtrl',
				      resolve: {
				        items: function () {
				          return _self.googleImages;
				        },
								noImages: function(){
									return _self.noImages;
								},
								searchTerm: function(){
									return searchTerm;
								}
				      }
				    });

						//Wait for a result of the image popup
						imagePopup.result.then(function (selectedItem) {
				      _self.newWish.image = selectedItem;
				    });

					});
			}

		}

    _self.reset = resetForm;
    _self.createWish = createWish;
		_self.searchImages = searchImagesOnGoogle;

    _self.currentReceiverID = receiverModel.getCurrentReceiver()._id;
    _self.currentUserID = UserService.getCurrentUser()._id;

    resetForm();

  }])
	.controller('sendWishlistController', ['$stateParams', 'CONFIG', function($stateParams, CONFIG){
		var self = this;

		self.url = CONFIG.siteBaseUrl + "/#/wishlist/" + $stateParams.receiverID;
	}])
	.controller('imagePopupCtrl', function ($uibModalInstance, items, noImages, searchTerm) {
	  var _self = this;
	  _self.items = items;
	  _self.selected = {
	    item: _self.items[0]
	  };
		_self.noImages = noImages;
		_self.searchTerm = searchTerm;

		_self.ok = function () {
	    $uibModalInstance.close(_self.selected.item);
	  };

	  _self.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };
	});
;
