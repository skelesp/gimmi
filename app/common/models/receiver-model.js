﻿angular.module('gimmi.models.receiver', [
	'gimmi.person',
	'gimmi.config'
])
	.service('receiverModel', ["$http", "$q", "$rootScope", "PersonService", "CONFIG", function ($http, $q, $rootScope, PersonService, CONFIG) {
		var model = this,
			URLS = {
				FETCH: CONFIG.apiUrl + '/api/people'
			},
			receivers,
			currentReceiver;

		function extract(result) {
			return result.data;
		};

		function cacheReceivers(result) {
			receivers = extract(result);
			$rootScope.$broadcast('receivers:update', receivers);
			return receivers;
		}

		model.getReceivers = function () {
			return (receivers) ? $q.when(receivers) : $http.get(URLS.FETCH).then(cacheReceivers);
		};

		model.refreshReceivers = function(){
			receivers = null;
			return model.getReceivers();
		}

		model.setCurrentReceiver = function (receiver){
			var deferred = $q.defer();
			if (receiver) {
				currentReceiver = receiver;
				deferred.resolve(currentReceiver);
			} else {
				currentReceiver = {};
				deferred.reject(currentReceiver);
			}
			return deferred.promise;
		};

		model.getCurrentReceiver = function(){
			return currentReceiver;
		};

		model.getCurrentReceiverName = function() {
			return currentReceiver ? currentReceiver.firstName + " " + currentReceiver.lastName : '';
		};

		model.getCurrentReceiverId = function() {
			return currentReceiver ? currentReceiver.id : '';
		};

		model.getReceiverByName = function (receiverName) {
			var deferred = $q.defer();

			function findReceiver() {
				return _.find(receivers, function(r){
					return r.fullName === receiverName;
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

		model.getReceiverByID = function (receiverID) {
			var deferred = $q.defer();

			function findReceiver() {
				return _.find(receivers, function(r){
					return r._id === receiverID;
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
	}])
;
