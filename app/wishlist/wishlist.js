angular.module('wishlist', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver',
	'wishlist.receiver',
	'gimmi.config',
	'gimmi.authentication',
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
				//TODO: get ONLY the wishes for this receiver
				wishModel.getWishes().then(function(wishes) {
					wishlistCtrl.wishes = wishes;
				});
				wishlistCtrl.userIsReceiver = UserService.userIsReceiver(currentReceiver._id);
		} else {
			wishlistCtrl.userIsReceiver = false;
		}
	}])

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

			if (searchTerm){
				SearchService.getSearchResults(searchTerm)
					.then(function (results) {
						if (results.data) {
							console.info("Images gevonden.")
							_self.noImages = false;
							var searchResults = results.data;
							searchResults.forEach(function(item){
								if (item.link) {
									_self.googleImages.push(item.link);
								}
							});
						}
						else {
							console.error("Geen images gevonden.")
							_self.noImages = true;
							_self.googleImages.push("https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTaO2OnPKQ3_p3RdI1KZkj6XP-8il5iRO9iGj9Xj8TT0KuKTE_Ynw")
						}

						var imagePopup = $uibModal.open({
				      ariaLabelledBy: 'modal-title',
				      ariaDescribedBy: 'modal-body',
				      templateUrl: 'googleImageSearchResults.html',
							size: 'lg',
				      controller: 'ModalInstanceCtrl',
				      controllerAs: 'InstanceCtrl',
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
	.controller('ModalInstanceCtrl', function ($uibModalInstance, items, noImages, searchTerm) {
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
