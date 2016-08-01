angular.module('gimmi.models.receiver', [

])
	.service('receiverModel', function($http, $q) {

		var model = this,
			URLS = {
				FETCH: 'data/receivers.json'
			},
			receivers,
			currentReceiver;

		function extract(result) {
			return result.data;
		};

		function cacheReceivers(result) {
			receivers = extract(result);
			return receivers;
		}

		model.getReceivers = function () {
			return (receivers) ? $q.when(receivers) : $http.get(URLS.FETCH).then(cacheReceivers);
		};

		model.setCurrentReceiver = function (receiverName){
				return model.getReceiverByName(receiverName)
					.then(function(receiver){
						currentReceiver = receiver;
					});
		};

		model.getCurrentReceiver = function(){
			return currentReceiver;
		};

		model.getCurrentReceiverName = function() {
			return currentReceiver ? currentReceiver.name : '';
		};

		model.getCurrentReceiverId = function() {
			return currentReceiver ? currentReceiver.id : '';
		};

		model.getReceiverByName = function (receiverName) {
			var deferred = $q.defer();

			function findReceiver() {
				return _.find(receivers, function(r){
					return r.name === receiverName;
				})
			}

			if (receivers) {
				deferred.resolve(findReceiver());
			} else {
				model.getReceivers()
					.then(function(result){
						deferred.resolve(findReceiver());
					})
			}

			return deferred.promise;
		};
	})
;
