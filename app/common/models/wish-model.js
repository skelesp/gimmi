angular.module('gimmi.models.wish', [
	'gimmi.config'
])
	.service('wishModel', function($http, $q, CONFIG){
		var model = this,
			URLS = {
				FETCH: CONFIG.apiUrl + '/api/wishes',
				WISH: CONFIG.apiUrl + '/api/wish'
			},
			wishes;

		function extract(result) {
			return result.data;
		};

		function cacheWishes(result) {
			wishes = extract(result);
			return wishes;
		}

		function findWish(wishID) {
			return _.find(wishes, function(w) {
				return w._id == wishID;
			})
		}

		model.getWishById = function (wishID) {
			var deferred = $q.defer();

			if(wishes) {
				deferred.resolve(findWish(wishID));
			} else {
				model.getWishes().then(function(){
					deferred.resolve(findWish(wishID));
				});
			}

			return deferred.promise;
		};

		model.getWishes = function() {
			var deferred = $q.defer();

			if(wishes) {
				deferred.resolve(wishes);
			} else {
				$http.get(URLS.FETCH).then(function(result){
						deferred.resolve(cacheWishes(result));
				});
			}

			return deferred.promise;
		};

		model.createWish = function (wish, receiverID, userID){
			wish.receiver = receiverID;
			wish.createdBy = userID;
			wish.status = "free";

			$http.post(URLS.WISH, wish).success(function(wish){
				wishes.push(wish);
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
