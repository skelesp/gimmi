angular.module('gimmi.models.wish', [
	'gimmi.config'
])
	.service('wishModel', function($http, $q, CONFIG){
		var model = this,
			URLS = {
				WISHLIST: CONFIG.apiUrl + '/api/wishlist',
				WISH: CONFIG.apiUrl + '/api/wish'
			},
			wishes;

		function extract(result) {
			return result.data;
		};

		function findWish(wishID) {
			return _.find(wishes, function(w) {
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

			$http.get(URLS.WISHLIST+"/"+receiverID).then(function(result){
					deferred.resolve(result.data[0]);
			});

			return deferred.promise;
		};

		model.createWish = function (wish, receiverID, userID){
			wish.receiver = receiverID;
			wish.createdBy = userID;
			wish.status = "free";

			$http.post(URLS.WISH, wish).success(function(wish){
				console.info("Wish created: " + wish.title);
			});

		};

		model.updateWish = function(wish) {
			$http.post(URLS.WISH+"/"+wish._id, wish).success(function(wish){
				var index = _.findIndex(wishes, function(w){
					return w._id === wish._id;
				});

				wishes[index] = wish;
			});
		}

		model.deleteWish = function(wish) {
			$http.delete(URLS.WISH+"/"+wish._id).success(function(){
				_.remove(wishes, function(w){
					return w._id === wish._id;
				});
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
