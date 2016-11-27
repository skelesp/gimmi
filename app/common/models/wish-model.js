angular.module('gimmi.models.wish', [

])
	.service('wishModel', function($http, $q){
		var model = this,
			URLS = {
				FETCH: 'http://localhost:5000/api/wishes',
				WISH: 'http://localhost:5000/api/wish'
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
				return w.id === parseInt(wishID, 10);
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

		model.createWish = function (wish, receiverID){
			wish.receiver = receiverID;
			wish.status = "free";
			console.log("new Wish:", wish);
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

		model.reserve = function(wish) {
			wish.status = "reserved";
			model.updateWish(wish);
		}

		model.setFree = function(wish) {
			wish.status = "free";
			model.updateWish(wish);
		}

	})
;
