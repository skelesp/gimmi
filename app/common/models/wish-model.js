angular.module('gimmi.models.wish', [
	'gimmi.config'
])
	.service('wishModel', ['$http', '$q', '$uibModal', 'CONFIG', 'Flash', 'cloudinaryService', 'UserService', function ($http, $q, $uibModal, CONFIG, Flash, cloudinaryService, UserService){
	var model = this,
		URLS = {
			WISHLIST: CONFIG.apiUrl + '/api/wishlist',
			WISH: CONFIG.apiUrl + '/api/wish'
		},
		wishlist;

	function extract(result) {
		return result.data;
	};

	function findWish(wishID) {
		return _.find(wishlist.wishes, function(w) {
			return w._id == wishID;
		})
	}

	function convertUndefinedToNovalue(object) {
		return _.mapValues(object, function (value) {
			if (typeof value === 'undefined' || value === "") {
				return "#*/NO_VALUE/*#";
			} else {
				return value;
			}
		});
	}

	function updateWishlist (wish) {
		if (wishlist) {
			var index = _.findIndex(wishlist.wishes, function (w) {
				return w._id === wish._id;
			});
			var wishlistWish = angular.copy(wish);
			// TEMP FIX until #906 is implemented
			if (wish.reservation) {
				wishlistWish.reservation.reservedBy = wishlistWish.reservation.reservedBy._id;
			} // END TEMP FIX
			getWishStatus(wishlistWish).then(function(wish){
				wishlist.wishes[index] = wish;
			});
		}
	}

	function getWishStatus(wish) { //#1660: use new GET wish/:id/state route in API
		var deferred = $q.defer();

		$http.get(URLS.WISH + "/" + wish._id + "/state").then(function (result) {
			wish.state = result.data;
			deferred.resolve(wish);
		});

		return deferred.promise;
	}
	model.getWishById = function (wishID) {
		var deferred = $q.defer();

		$http.get(URLS.WISH+"/"+wishID).then(function(result){
				deferred.resolve(result.data[0]);
		});

		return deferred.promise;
	};

	model.getWishlist = function(receiverID) {
		var deferred = $q.defer();
		if (wishlist && wishlist._id.receiver._id === receiverID) {
			deferred.resolve(wishlist);
		} else {
			$http.get(URLS.WISHLIST+"/"+receiverID).then(function(result){
				wishlist = result.data[0];
				// Get the state of all wishes in the wishlist
				var wishPromises = wishlist.wishes.map((wish) => {
					return getWishStatus(wish).then(function (wish) {
						return wish;
					});
				});
				// Wait for all wish promises in map() above before resolving the getWishlist promise
				// https://stackoverflow.com/questions/39452083/using-promise-function-inside-javascript-array-map
				$q.all(wishPromises).then(function (wishlistResult) { 
					wishlist.wishes = wishlistResult; 
					deferred.resolve(wishlist);
				});
			});
		}
		
		return deferred.promise;
	};

	model.getCopies = function(receiverID) {
		var deferred = $q.defer();

		if (!receiverID) {
			deferred.reject("No receiver");
		} else {
			$http.get(URLS.WISHLIST + "/" + receiverID + "/copies").then (function(results){
					deferred.resolve(results.data);
				})
		}

		return deferred.promise;
	}

	model.createWish = function (wish, receiverID, userID, copyOf, callback){
		wish.receiver = receiverID;
		wish.createdBy = userID;

		if (copyOf) {
			wish.copyOf = copyOf;
		}

		if (!wish.image){
			wish.image = CONFIG.defaultImage;
		}
		
		$http.post(URLS.WISH, wish).success(function(createdWish){
			wish = createdWish;
			// Put wish on current wishlist
			if (wishlist._id.receiver._id === receiverID) {
				wishlist.wishes.push(createdWish);
				wishlist.count++;
				var message = "De wens '" + createdWish.title + "' werd toegevoegd aan deze lijst.";
				var flashID = Flash.create('success', message);
			} else {
				console.info("%s copied a wish from wishlist %s", userID, receiverID);
				// Show flashmessage voor succesvolle copy
				var message = "De wens '" + createdWish.title + "' werd gekopieerd naar je eigen lijst.";
				var flashID = Flash.create('success', message);
			}
			// if wish is a copy, then the image must be copied too (but wishID is needed, so this must be done after wish create)
			if (createdWish.copyOf && createdWish.image) { 
				// Generate a url to the original image
				var imageUrl = cloudinaryService.generateCloudinaryUrl(createdWish.image.public_id, createdWish.image.version);
				// Upload the original image to cloudinary with publicID of the new wish
				cloudinaryService.uploadImage(createdWish._id, imageUrl, function(error, result){
					// Handle errors of image upload
					if (error) {
						return console.log(error);
					}
					// If image is uploaded: update the new wish
					if (result) {
						var image = result.data;
						createdWish.image = {
							public_id: image.public_id,
							version: image.version
						};
						model.updateWish(createdWish).then(function(wish){
							if (callback) {
								callback(null, wish);
							}
						});
					}
				});
			} else if (createdWish.image && createdWish.image.public_id.slice(-CONFIG.temporaryImagePostfix.length) === CONFIG.temporaryImagePostfix) {
				// Rename temporary image.public_id to wish_id
				cloudinaryService.renameImage(createdWish.image.public_id, createdWish._id)
					.then(function (image) {
						// Update wish with renamed image
						wish.image = image;
						model.updateWish(wish).then(function (wish) {
							console.info(`Wish ${wish._id} is created and temp cloudinary image is renamed`);
					});
				});
			} else {
				if (callback) {
					callback(null, wish);
				}
			}
		});
	};
	model.openWishPopup = function (wish){
		return $uibModal.open({
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'app/wishlist/wish/wish_popup.tmpl.html',
			size: 'lg',
			backdrop: 'static',
			controller: 'wishPopupCtrl',
			controllerAs: 'wishPopup',
			resolve: {
				user: ['UserService', function (UserService) {
					return UserService.getCurrentUser();
				}],
				wish: function () {
					var originalWish = angular.copy(wish);
					return originalWish;
				}
			}
		});
	};

	model.updateWish = function(wish) {
		wish = convertUndefinedToNovalue(wish);
		var defer = $q.defer();
		// If no image is selected: set default image
		if (!wish.image){
			wish.image = CONFIG.defaultImage;
		}
		// Check if image is a temporary image and rename to wishID
		var renamedImagePromise = null;
		if (wish.image && wish.image.public_id.slice(-CONFIG.temporaryImagePostfix.length) === CONFIG.temporaryImagePostfix) {
			// Rename temporary image.public_id to wish_id
			renamedImagePromise = cloudinaryService.renameImage(wish.image.public_id, wish._id).then( function (image) {
				// Update wish with renamed image
				wish.image = image;
				return wish;
			});
		}
		// Wait until renameImagePromise is resolved and send updated wish to server
		$q.all([renamedImagePromise]).then(function(wishWithRenamedImage){
			if (wishWithRenamedImage[0]) { // $q.all returns an array, wish is in "wishWithRenamedImage[0]"
				wish = wishWithRenamedImage[0];
			}
			$http.put(URLS.WISH + "/" + wish._id, wish).success(function (wish) {
				updateWishlist(wish);
				defer.resolve(wish);
				console.info("wish updated", wish);
			});
		})
		return defer.promise;
	}
	
	model.deleteWish = function(wish) {
		$http.delete(URLS.WISH+"/"+wish._id).success(function(){
			if (wishlist) {
				_.remove(wishlist.wishes, function(w){
					return w._id === wish._id;
				});
			}
			cloudinaryService.deleteImage(wish.image.public_id, function () {
				console.info("wish deleted: " + wish._id);
			});
		});
	}

	model.addReservation = function(wishID, reservation) {
		var defer = $q.defer();
		$http.post(URLS.WISH+"/"+wishID+"/reservation", reservation).success(function(wish){
			updateWishlist(wish);
			console.info("Reservation added to", wish._id);
			defer.resolve(wish);
		});
		return defer.promise;
	}

	model.deleteReservation = function(wishID) {
		$http.delete(URLS.WISH+"/"+wishID+"/reservation/").success(function(wish){
			if (wishlist) {
				updateWishlist(wish);
			}
			console.info("Reservation deleted for ", wish._id);
		});
	}

	model.addFeedback = function (wishID, giftFeedback) {
		var defer = $q.defer();
		$http.post(URLS.WISH + "/" + wishID + "/feedback", giftFeedback).success(function (wish) {
			updateWishlist(wish);
			console.info("Gift feedback added to", wish._id);
			defer.resolve(wish);
		});
		return defer.promise;
	}

	model.close = function (wishID, closureInfo) {
		var defer = $q.defer();
		// Zet de closed date op "nu"
		closureInfo.closedOn = new Date();
		
		// REST API call om de closure toe te voegen
		$http.post(URLS.WISH + "/" + wishID + "/closure", closureInfo).success(function (wish) {
			updateWishlist(wish);
			console.info("Closure added to", wish._id);
			var message = "Cadeau '" + wish.title + "' is ontvangen en werd afgesloten. Je kan deze nog terugvinden bij de 'ontvangen cadeaus'";
			Flash.create('success', message);
			defer.resolve(wish);
		});
		return defer.promise;
	}
}])
;
