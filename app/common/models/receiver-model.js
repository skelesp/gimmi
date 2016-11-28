﻿angular.module('gimmi.models.person', [
	'gimmi.person',
	'gimmi.config'
])
	.service('receiverModel', ["$http", "$q", "PersonService", "CONFIG", function($http, $q, PersonService, CONFIG) {

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
			return receivers;
		}

		model.getReceivers = function () {
			return (receivers) ? $q.when(receivers) : $http.get(URLS.FETCH).then(cacheReceivers);
		};

		model.setCurrentReceiver = function (receiverID){
				return PersonService.getPersonFromID(receiverID)
					.then(function(receiver){
						currentReceiver = receiver;
					});
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
