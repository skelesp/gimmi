angular.module('gimmi.models.wish', [
	'gimmi.config'
])
	.service('wishModel', ['$http', '$q', 'CONFIG', 'Flash', 'cloudinaryService', function($http, $q, CONFIG, Flash, cloudinaryService){
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
			wishlistWish.reservation.reservedBy = wishlistWish.reservation.reservedBy._id;
			wishlist.wishes[index] = wishlistWish;
		}
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
				deferred.resolve(wishlist);
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
			if (callback) {
				callback(null, wish);
			}
		});
	};

	model.updateWish = function(wish) {
		var convertedWish = convertUndefinedToNovalue(wish);
		var defer = $q.defer();
		if (!wish.image){
			wish.image = CONFIG.defaultImage;
		}
		$http.put(URLS.WISH+"/"+wish._id, convertedWish).success(function(wish){
			if (wishlist) {
				var index = _.findIndex(wishlist.wishes, function(w){
					return w._id === wish._id;
				});
				// TEMP FIX until #906 is implemented
				if (wish.reservation) {
					wish.reservation.reservedBy = wish.reservation.reservedBy._id
				}
				// END TEMP FIX
				wishlist.wishes[index] = wish;
			}
			defer.resolve(wish);
			console.info("wish updated", wish);
		});
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
				console.info("wish and image deleted: " + wish._id);
			});
		});
	}

	model.addReservation = function(wishID, reservation) {
		var defer = $q.defer();
		$http.post(URLS.WISH+"/"+wishID+"/reservation", reservation).success(function(wish){
			if (wishlist) {
				var index = _.findIndex(wishlist.wishes, function(w){
					return w._id === wishID;
				});
				var wishlistWish = angular.copy(wish);
				wishlistWish.reservation.reservedBy = wishlistWish.reservation.reservedBy._id;
				wishlist.wishes[index] = wishlistWish;
			}
			console.info("Reservation added to", wish._id);
			defer.resolve(wish);
		});
		return defer.promise;
	}

	model.deleteReservation = function(wishID) {
		$http.delete(URLS.WISH+"/"+wishID+"/reservation/").success(function(wish){
			if (wishlist) {
				var index = _.findIndex(wishlist.wishes, function (w) {
					return w._id === wishID;
				});
				wishlist.wishes[index] = wish;
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
			var message = `Cadeau '${wish.title}' is ontvangen en werd afgesloten. Je kan deze nog terugvinden bij de 'ontvangen cadeaus'`;
			Flash.create('success', message);
			defer.resolve(wish);
		});
		return defer.promise;
	}

}])
;
