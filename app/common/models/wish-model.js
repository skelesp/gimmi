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
				console.log(wishlist);
			} else {
				$http.get(URLS.WISHLIST+"/"+receiverID).then(function(result){
					wishlist = result.data[0];
					deferred.resolve(result.data[0]);
					console.log(wishlist);
				});
			}

			return deferred.promise;
		};

		model.createWish = function (wish, receiverID, userID){
			wish.receiver = receiverID;
			wish.createdBy = userID;
			wish.status = "free";

			$http.post(URLS.WISH, wish).success(function(wish){
				console.info("Wish created: " + wish.title);
				wishlist.wishes.push(wish);
				wishlist.count++;
			});

		};

		model.updateWish = function(wish) {
			$http.post(URLS.WISH+"/"+wish._id, wish).success(function(wish){
				var index = _.findIndex(wishlist.wishes, function(w){
					return w._id === wish._id;
				});

				wishlist.wishes[index] = wish;
				console.info("wish updated", wish);
			});
		}

		model.deleteWish = function(wish) {
			$http.delete(URLS.WISH+"/"+wish._id).success(function(){
				_.remove(wishlist.wishes, function(w){
					return w._id === wish._id;
				});
				console.info("wish deleted: " + wish._id);
			});

		}

		model.reserve = function(wish, reservator) {
			wish.status = "reserved";
			wish.reservedBy = reservator._id;
			model.updateWish(wish);
		}

		model.setFree = function(wish) {
			wish.status = "free";
			wish.reservedBy = null;
			model.updateWish(wish);
		}

	})
;
