angular.module('gimmi.models.wish', [
	'gimmi.config'
])
	.service('wishModel', function($http, $q, CONFIG, Flash){
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

		model.createWish = function (wish, receiverID, userID){
			wish.receiver = receiverID;
			wish.createdBy = userID;

			if (!wish.image){
				wish.image = CONFIG.defaultImage;
			}
			
			$http.post(URLS.WISH, wish).success(function(wish){
				if (wishlist._id.receiver._id === receiverID) {
					console.info("Wish created: " + wish.title);
					wishlist.wishes.push(wish);
					wishlist.count++;
				} else {
					console.info("%s copied a wish from wishlist %s", userID, receiverID);
					// Show flashmessage voor succesvolle copy
					var message = "De wens '" + wish.title + "' werd gekopieerd naar uw lijst.";
					var flashID = Flash.create('success', message);
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
					wishlist.wishes[index] = wish;
				}
				defer.resolve(wish);
				console.info("wish updated", wish);
			});
			return defer.promise;
		}

		function convertUndefinedToNovalue (object) {
			return _.mapValues(object, function(value){
				if (typeof value === 'undefined' || value === "") {
					return "#*/NO_VALUE/*#";
				} else {
					return value;
				}
			});
		}
		model.deleteWish = function(wish) {
			$http.delete(URLS.WISH+"/"+wish._id).success(function(){
				if (wishlist) {
					_.remove(wishlist.wishes, function(w){
						return w._id === wish._id;
					});
				}
				console.info("wish deleted: " + wish._id);
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

	})
;
