angular.module('gimmi.models.wish', [
	'gimmi.config'
])
	.service('wishModel', function($http, $q, CONFIG){
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

			if (wishlist && wishlist._id.receiverID === receiverID) {
				deferred.resolve(wishlist);
			} else {
				$http.get(URLS.WISHLIST+"/"+receiverID).then(function(result){
					wishlist = result.data[0];
					deferred.resolve(result.data[0]);
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
				if (wishlist._id.receiverID === receiverID) {
					console.info("Wish created: " + wish.title);
					wishlist.wishes.push(wish);
					wishlist.count++;
				} else {
					console.info("%s copied a wish from wishlist %s", userID, receiverID);
				}
			});

		};

		model.updateWish = function(wish) {
			var convertedWish = convertUndefinedToNovalue(wish);
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
				console.info("wish updated", wish);
			});
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
			$http.post(URLS.WISH+"/"+wishID+"/reservation", reservation).success(function(wish){
				if (wishlist) {
					var index = _.findIndex(wishlist.wishes, function(w){
						return w._id === wishID;
					});
					wishlist.wishes[index] = wish;
				}
				console.info("Reservation added to", wish._id);
			});
		}

		model.deleteReservation = function(wishID) {
			$http.delete(URLS.WISH+"/"+wishID+"/reservation/").success(function(wish){
				var index = _.findIndex(wishlist.wishes, function(w){
					return w._id === wishID;
				});
				wishlist.wishes[index] = wish;
				console.info("Reservation deleted for ", wish._id);
			});
		}

	})
;
