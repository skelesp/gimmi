angular.module('gimmi.models.wish', [

])
	.service('wishModel', function($http, $q){
		var model = this,
			URLS = {
				FETCH: 'data/wishes.json'
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
				$http.get(URLS.FETCH).then(function(wishes){
						deferred.resolve(cacheWishes(wishes));
				});
			}

			return deferred.promise;
		};

		model.createWish = function (wish, receiverID){
			wish.id = wishes.length+1;
			wish.receiverID = receiverID;
			wish.status = "free";

			wishes.push(wish);
		};

		model.updateWish = function(wish) {
			var index = _.findIndex(wishes, function(w){
				return w.id === wish.id;
			});

			wishes[index] = wish;
		}

		model.deleteWish = function(wish) {
			_.remove(wishes, function(w){
				return w.id === wish.id;
			});
		}

	})
;
