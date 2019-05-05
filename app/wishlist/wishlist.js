angular.module('wishlist', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver',
	'wishlist.receiver',
	'gimmi.config',
	'gimmi.authentication',
	'gimmi.communication',
	'wishlist.wish',
	'gcse',
	'ngclipboard',
	'gimmi.person'
])
.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('gimmi.wishlist', {
			url: 'wishlist/:receiverID',
			views: {
				'content@': {
					templateUrl: 'app/wishlist/wishlist.tmpl.html',
					controller:'wishlistCtrl as wishlistCtrl',
					resolve: {
						wishlist: ['$stateParams', 'wishModel', function ($stateParams, wishModel){
							return wishModel.getWishlist($stateParams.receiverID);
						}],
						currentReceiver: ['wishlist', 'receiverModel', function(wishlist, receiverModel){
							return receiverModel.setCurrentReceiver(wishlist._id.receiver);
						}]
					}
				},
				'receiverSearch@gimmi': {
					controller: 'receiverSearchCtrl as receiverSearchCtrl',
					templateUrl: 'app/people/receiver/receiverSearch.tmpl.html',
					resolve: {
						receivers: ['receiverModel', function (receiverModel) {
							return receiverModel.getReceivers();
						}]
					}
				},
				'wishlist_item@gimmi.wishlist': {
					templateUrl: 'app/wishlist/wishlist_item.tmpl.html',
					controller: 'wishCtrl as wishCtrl'
				},
				'wish_create@gimmi.wishlist': {
					templateUrl: 'app/wishlist/wish/create/wish-create.tmpl.html',
					controller: 'createWishCtrl as createWishCtrl',
					resolve: {
						user: ['UserService', function(UserService){
							return UserService.getCurrentUser();
						}]
					}
				}
			},
			authenticate: true
		})
		.state('gimmi.wishlist.send',{
			url: '/send',
			views:{
				'content@': {
					templateUrl: 'app/wishlist/sendWishlist.tmpl.html',
					controller: 'sendWishlistController as sendWishlistCtrl'
				}
			},
			authenticate: true
		})
	;
}])
.controller('wishlistCtrl', ['UserService', 'PersonService', 'receiverModel', '$uibModal', 'wishlist', 'currentReceiver', 
		function wishlistCtrl(UserService, PersonService, receiverModel, $uibModal, wishlist, currentReceiver){
	var _self = this;

	_self.currentUserID = UserService.getCurrentUser().id;
	_self.currentReceiver = currentReceiver;
	_self.wishes = wishlist.wishes;
	
	/* Extra info */
	_self.extraInfo = wishlist._id.receiver.extraInfo;
	_self.extraInfoEditMode = false;
	_self.toggleExtraInfoMode = toggleExtraInfoMode;

	/* Received wishes */
	_self.showReceivedWishes = function showReceivedWishes() {
		$uibModal.open({
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'app/wishlist/receivedWishesPopup.tmpl.html',
			controller: 'receivedWishesPopupController',
			controllerAs: 'receivedWishesPopupCtrl',
			resolve: {
				receivedWishes: ['wishModel', function(wishModel) {
					return wishModel.getWishlist(currentReceiver._id).then(function(wishlist) {
						var receivedWishes = [];
						wishlist.wishes.forEach(function(wish){
							if (getReservationStatus(wish) === 'fulfilled') {
								receivedWishes.push(wish);
							};
						});
						return receivedWishes;
					});
				}],
				receiver: function(){
					return currentReceiver;
				}
			}
		});
	};
	_self.filterOpenWish = function(wish){
		if (getReservationStatus(wish) !== 'fulfilled') {
			return true;	
		};
		return false;
	}
	_self.deleteDislike = function(index) {
		_self.updatedExtraInfo.dislikes.splice(index, 1);
	}
	_self.deleteLike = function(index) {
		_self.updatedExtraInfo.likes.splice(index, 1);
	}
	_self.addLike = function() {
		if (_self.newLike.text) {
			_self.updatedExtraInfo.likes.push(_self.newLike);
			_self.newLike = {};
		}
	}
	_self.addDislike = function() {
		if (_self.newDislike.text) {
			_self.updatedExtraInfo.dislikes.push(_self.newDislike);
			_self.newDislike = {};
		}
	}
	_self.saveExtraInfo = function() {
		PersonService.updateExtraInfo(wishlist._id.receiver._id, _self.updatedExtraInfo.likes, _self.updatedExtraInfo.dislikes)
			.then(function (person) {
				_self.extraInfo = person.extraInfo;
				toggleExtraInfoMode();
			}, function (err) {
				console.log("ERROR while updating extra info: " + err);
			});
	}
	_self.cancelExtraInfo = function() {
		delete _self.updatedExtraInfo;
		toggleExtraInfoMode();
	}
	
	function toggleExtraInfoMode(){
		_self.extraInfoEditMode = !_self.extraInfoEditMode;
		if (_self.extraInfoEditMode) {
			if (_self.extraInfo) {
				_self.updatedExtraInfo = angular.copy(_self.extraInfo);
			} else {
				_self.updatedExtraInfo = {
					"likes" : [],
					"dislikes": []
				}
			}
		}
	}

	function getReservationStatus(wish) {
		var reservationStatus = "unreserved";
		if (wish.reservation && !wish.closure) {
			if (!isIncognitoReservation(wish)) {
				reservationStatus = "reserved";
			}
		} else if (wish.closure) {
			reservationStatus = "fulfilled";
		}
		return reservationStatus;
	}
	function isIncognitoReservation(wish) {
		var now = new Date();
		return (UserService.userIsReceiver(receiverModel.getCurrentReceiver()._id) && (!reservedByUser(wish.reservation.reservedBy)) && (wish.reservation.handoverDate > now.toISOString()));
	}
	function reservedByUser(reservatorID) {
		if (UserService.getCurrentUser()._id === reservatorID) {
			return true;
		} else {
			return false;
		}
	};
	// TODO: verwijder onderstaande code uit controller: hoort hier niet!
	if (currentReceiver) {
		_self.userIsReceiver = UserService.userIsReceiver(currentReceiver._id);
	} else {
		_self.userIsReceiver = false;
	}
}])
.controller('wishCtrl', ['$state', '$stateParams', '$uibModal', 'wishModel', 'receiverModel', 'UserService', 'PersonService','CommunicationService', 
		function ($state, $stateParams, $uibModal, wishModel, receiverModel, UserService, PersonService, CommunicationService) {
	var _self = this;
	/* TODO: CreatorID en ReceiverID ophalen bij initialiseren van de controller */

	_self.userIsCreator = function(creatorID){
		if (UserService.isLoggedIn()) {
			return UserService.getCurrentUser()._id === creatorID;
		} else {
			return false;
		}
	};

	_self.receiverIsCreator = function(creatorID, receiverID) {
		return creatorID === receiverID;
	}

	function reservedByUser (reservatorID){
		if (UserService.isLoggedIn()) {
			if (UserService.getCurrentUser()._id === reservatorID) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	_self.goToWishDetail = function(wish) {
		if ( getReservationStatus(wish) !== 'reserved') {
			$state.go('gimmi.wishlist.wish', { wishID: wish._id });
			console.log("image clicked");
		}
	}

	function copy(wish){
		console.log("Wens " + wish._id + " kopiëren...");
		var userID = UserService.getCurrentUser()._id;
		var newWish = {};
		newWish.title = wish.title;
		newWish.image = wish.image;
		newWish.url = wish.url;
		newWish.price =  wish.price;
		
		wishModel.getCopies(userID)
			.then(function (results) {
				// Check if wish is already copied to list
				var copyExistsOnList = _.find(results, function (r) {
					return r.copyOf === wish._id;
				});
				
				(copyExistsOnList 
					// If copy exists: open modal and return result (=promise)
					? $uibModal.open({ 
						ariaLabelledBy: 'modal-title',
						ariaDescribedBy: 'modal-body',
						templateUrl: 'copyWishWarning.html',
						size: 'md',
						controller: 'copyWarningPopupCtrl',
						controllerAs: 'copyWarningPopupCtrl',
						resolve: {
							wish: function () {
								return wish;
							}
						}
					}).result 
					// If copy doesn't exist: immediately resolve a promise with the wish
					: Promise.resolve(wish))
				.then(function (wish) { // When promise resolves: create copy of wish
					wishModel.createWish(newWish, userID, userID, wish._id);
				}, function(err){ // When promise is rejected (modal is cancelled): log to console
					console.log("Copy is cancelled");
				});
			}, function (err) { // Log getCopies error to console
				console.log(err);
			});
	}

	function edit(wish){
		console.info("Wish in edit mode");
		var editPopup = $uibModal.open({
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'editWish.html',
			size: 'md',
			controller: 'editPopupCtrl',
			controllerAs: 'editPopupCtrl',
			resolve: {
				wish: function () {
					var originalWish = angular.copy(wish);
					return originalWish;
				},
				user: ['UserService', function (UserService) {
					return UserService.getCurrentUser();
				}]
			}
		});

		editPopup.result.then(function(wish) {
			wishModel.updateWish(wish);
			console.info(wish.title + " is gewijzigd.");
		});
	}

	function deleteWishVerification (wish) {
		//Create a popup instance for delete verification
		var deletePopup = $uibModal.open({
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'deleteVerification.html',
			size: 'md',
			controller: 'deletePopupCtrl',
			controllerAs: 'deletePopupCtrl',
			resolve: {
				wish: function () {
					return wish;
				}
			}
		});

		deletePopup.result.then(function (wish) {
			wishModel.deleteWish(wish);
			console.info(wish._id + " is verwijderd.")
		});
	}

	function addReservation (wish, userID, reason, receiver) {
		/*var reservation = {
			reservator: userID,
			reason: reason
		};*/
		var wishReservationPopup = $uibModal.open({
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'wishReservation.html',
			size: 'md',
			controller: 'wishReservationPopupCtrl',
			controllerAs: 'wishReservationPopupCtrl',
			resolve: {
				wish: function () {
					return wish;
				},
				receiver: function() {
					return receiver
				}
			}
		});

		wishReservationPopup.result.then(function(reservation) {
			reservation.reservationDate = new Date();
			reservation.reservedBy = userID;

			wishModel.addReservation(wish._id, reservation);
		});
	}

	function deleteReservation (wish) {
			wishModel.deleteReservation(wish._id);
	}

	function isIncognitoReservation(wish){
		var now = new Date();
		return (UserService.userIsReceiver(receiverModel.getCurrentReceiver()._id) && (!reservedByUser(wish.reservation.reservedBy)) && (wish.reservation.handoverDate > now.toISOString()) );
	}
	
	function getReservationStatus (wish) {
		var reservationStatus = "unreserved";
		if (wish.reservation && !wish.closure) {
			if (!isIncognitoReservation(wish)) {
				reservationStatus = "reserved";
			}
		} else if (wish.closure) {
			reservationStatus = "fulfilled";
		}
		return reservationStatus;
	}

	function openFeedbackPopup(wish) {
		var giftFeedbackPopup = $uibModal.open({
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'app/wishlist/giftFeedbackPopup.tmpl.html',
			controller: 'giftFeedbackPopupController',
			controllerAs: 'giftFeedbackPopupCtrl',
			resolve: {
				wish: function () {
					return wish;
				},
				reservator: ['PersonService', function(PersonService){
					if (wish.reservation) {
						return PersonService.getNameById(wish.reservation.reservedBy);
					}
					return null;
				}]
			}
		});
		giftFeedbackPopup.result.then(function (result) {
			var giftFeedback = result.giftFeedback;
			var reservator = result.reservator;
			//wishID, feedback-object needed for call
			wishModel.addFeedback(wish._id, giftFeedback).then(function(wish) {
				var closureInfo = {
					closedBy: UserService.getCurrentUser()._id,
					reason: "Cadeau ontvangen"
				};
				wishModel.close(wish._id, closureInfo).then(function (wish) {
					console.log("Wish " + wish._id + " is closed");
				});
				if (giftFeedback.putBackOnList) {
					_self.copy(wish);
				}
				if (giftFeedback.message) {
					PersonService.getEmailById(reservator._id).then(function(email){
						PersonService.getNameById(wish.receiver).then(function(person){
							reservator.email = email;
							var receiver = person;
							var mail = {
								to: reservator.email,
								subject: "[GIMMI] " + receiver.fullName + " bedankt je voor je cadeau!!",
								html: reservator.firstName + "<br/><br/>Je hebt onlangs op Gimmi het cadeau '" + wish.title + "' gereserveerd voor " + receiver.fullName + ". <br/>Onlangs heb je dit cadeau afgegeven en daarnet heeft " + receiver.firstName + " je een boodschap nagelaten:<br/><br/><em>" + giftFeedback.message + "</em><br/><br/>Bedankt om Gimmi te gebruiken en hopelijk tot snel voor een nieuwe succesvolle cadeauzoektocht!"
							}
							console.log("Verstuur een mail:", mail);
							CommunicationService.sendMail(mail);
						});
					});
				}
			});
		});
	}

	_self.reservationStatus = getReservationStatus;
	_self.reservedByUser = reservedByUser;
	_self.copy = copy;
	_self.edit = edit;
	_self.deleteWish = deleteWishVerification;
	_self.addReservation = addReservation;
	_self.deleteReservation = deleteReservation;
	_self.openFeedbackPopup = openFeedbackPopup;
}])
.controller('editPopupCtrl', ['$window', '$uibModalInstance', 'cloudinaryService', 'CONFIG', 'wish', 'user', function ($window, $uibModalInstance, cloudinaryService, CONFIG, wish, user) {
	var _self = this;
	var currentImage = wish.image;
	_self.wish = wish;
	_self.temporaryPublicID = cloudinaryService.generateRandomPublicID(user._id, CONFIG.temporaryImagePostfix);
	_self.ok = function () {
		if (_self.wish.image !== currentImage) {
			cloudinaryService.renameImage(_self.wish.image.public_id, _self.wish._id, function (image) {
				wish.image = image;
				$uibModalInstance.close(wish);
			});
		} else {
			$uibModalInstance.close(wish);
		}
	};
	_self.cancel = function () {
		if (_self.wish.image !== currentImage) {
			cloudinaryService.deleteImage(_self.wish.image.public_id, function () {
				$uibModalInstance.dismiss('cancel');
			});
		} else {
			$uibModalInstance.dismiss('cancel');
		}
	};
	_self.goToTitle = function(){
		$window.document.getElementById('EditWishTitle').focus();
	};
}])
.controller('copyWarningPopupCtrl', ['$window', '$uibModalInstance', 'wish', function ($window, $uibModalInstance, wish) {
	var _self = this;

	_self.title = wish.title;
	_self.ok = function () {
		$uibModalInstance.close(wish);
	};
	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}])
.controller('wishReservationPopupCtrl', ['$uibModalInstance', 'wish', 'receiver', function($uibModalInstance, wish, receiver) {
	var _self = this;
	// Define default values
	var reservation = {
		amount: 1, 
		reason: '', 
		handoverDate: new Date()
	};
	_self.reservation = reservation;
	_self.wishTitle = wish.title;
	_self.receiverName = receiver.firstName;
	_self.ok = function () {
		$uibModalInstance.close(reservation);
	};
	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}])
.controller('deletePopupCtrl', ['$uibModalInstance', 'wish', function ($uibModalInstance, wish){
	var _self = this;
	_self.wishTitle = wish.title;
	_self.ok = function () {
		$uibModalInstance.close(wish);
	};

	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}])
.controller('createWishCtrl', ['$stateParams', 'CONFIG', 'wishModel', 'user',
	function ($stateParams, CONFIG, wishModel, user){
	/* Initialize variables */
	var _self = this;
	_self.wishCardImage = CONFIG.defaultImage;
	_self.openAddWishPopup = function () {
		var createWishPopup = wishModel.openWishPopup();
		createWishPopup.result.then(function (newWish) {
			var receiverID = $stateParams.receiverID;
			var userID = user._id;
			wishModel.createWish(newWish, receiverID, userID, null, null);
		});
	};
}])
.controller('sendWishlistController', ['$rootScope', '$state', '$stateParams', '$uibModal', '$templateCache', 'CONFIG', 'UserService', 'receiverModel', 'Flash', 'CommunicationService', function ($rootScope, $state, $stateParams, $uibModal, $templateCache, CONFIG, UserService, receiverModel, Flash, CommunicationService){
	var self = this;
	var wishUrl = CONFIG.siteBaseUrl + "/#/wishlist/" + $stateParams.receiverID;
	//#105: onderstaande IF moet eigenlijk in de route staan en niet in de controller...
	self.receiverID = $stateParams.receiverID;
	self.url = wishUrl;
	self.postOnFacebook = function(){
		FB.ui({
			method: 'feed',
			link: wishUrl,
			caption: 'Een link naar mijn wensenlijst',
			description: "Testbeschrijving"
		}, function (response) {
			console.log(response);
			console.log(wishUrl);
		});
	};
	self.sendToFacebookFriends = function(){
		FB.ui({
			method: 'send',
			link: wishUrl
		}, function (response) {
			console.log(response);
			console.log(wishUrl);
		});
	}
	self.shareOnFacebook = function(){
		FB.ui({
			method: 'share',
			href: wishUrl
		}, function (response) {
			console.log(response);
			console.log(wishUrl);
		});
	}
	self.sendInvitationPopup = function(){
		var invitationPopup = $uibModal.open({
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: '/app/communication/invitationPopup.tmpl.html',
			controller: 'invitationPopupCtrl',
			controllerAs: 'invitationPopupCtrl',
			resolve: {}
		});
		invitationPopup.result.then(function (mailTo) {
			var receiver = receiverModel.getCurrentReceiver();

			var mailTo = mailTo.split(',');
			mailTo.forEach(function (to) {
				var mailUrl = self.url + '?e=' + encodeURIComponent(to);
				var mailHtml = '<html><body>Hallo,<br />' + receiver.firstName + " " + receiver.lastName + ' nodigt je met veel plezier uit op Gimmi. Op deze manier kan je ' + receiver.firstName + ' echt gelukkig maken met het perfecte cadeau! En nog meer goed nieuws: als je op de link van ' + receiver.firstName + ' klikt maken we voor jou ook dadelijk een lijstje aan. Hierop kan je je eigen droomcadeau’s plaatsen en kan je tactvol aan je famillie en vrienden laten weten hoe ze jou gelukkig kunnen maken.<br />Klik <a href="' + mailUrl + '">hier</a> of kopieer de link: ' + mailUrl + '<br /><br /><p>Veel plezier!</p><br /><p>Het Gimmi team</p></body></html>'
				mail = {
					to: to,
					subject: receiver.firstName + " " + receiver.lastName + " nodigt je uit op zijn/haar wensenlijst op Gimmi.",
					html: mailHtml
				}
				
				CommunicationService.sendMail(mail).then(function(mailResponse){
					console.log(mailResponse);
					var message = "De mail werd verzonden.";
					var flashID = Flash.create('success', message);
				}, function(error){
					var message = "Er is iets fout gelopen bij het verzenden van de mail:" + error;
					var flashID = Flash.create('danger', message);
				});
			});
		});
	};

	self.messengerLink = "fb-messenger://share/?link=" + encodeURIComponent(wishUrl) + "&app_id=" + CONFIG.fbID;
	self.whatsappLink = "whatsapp://send?text=Hieronder een link waarop ik mijn wensenlijst heb gezet. %0A%0A" + encodeURIComponent(wishUrl);
	self.showCopyTooltip = false;
	self.wishIsCopied = function(e) {
		e.clearSelection();
		console.info("URL copied to clipboard: " + e.text);
		var message = "De link werd gekopieerd naar het klembord. Je kan deze nu overal plakken.";
		var flashID = Flash.create('success', message);
		self.showCopyTooltip = true;
	}
}])
.controller('invitationPopupCtrl', ['$uibModalInstance', function ($uibModalInstance){
	var self = this;

	self.mailTo;
	self.ok = function(){
		$uibModalInstance.close(self.mailTo);
	};

	self.cancel = function(){
		$uibModalInstance.dismiss('Cancel');
	};
}])
.controller('giftFeedbackPopupController', ['$uibModalInstance', 'reservator', 'wish', function ($uibModalInstance, reservator, wish){
	var feedbackPopup = this;
	/* Set popup properties */
	var reservationDate = wish.reservation.handoverDate ? new Date(wish.reservation.handoverDate) : new Date ();
	feedbackPopup.reservator = reservator;
	feedbackPopup.wish = wish;
	/* Set map to map rate to satisfaction value */
	var satisfactionRatingMap = new Map();
	satisfactionRatingMap.set(0, "...");
	satisfactionRatingMap.set(1, "Helemaal niet blij");
	satisfactionRatingMap.set(2, "Niet blij");
	satisfactionRatingMap.set(3, "Neutraal");
	satisfactionRatingMap.set(4, "Blij");
	satisfactionRatingMap.set(5, "Heel blij");
	// IE HACK: Convert the map to an Array, because IE doesn't accepts this in the satisfaction rating object as an object method on "titles"
	if (!satisfactionRatingMap.values) {
		//Manually add all the map values in an Array, because IE11 doesn't support map.values()
		satisfactionRatingArray = [
			satisfactionRatingMap.get(0), 
			satisfactionRatingMap.get(1), 
			satisfactionRatingMap.get(2), 
			satisfactionRatingMap.get(3), 
			satisfactionRatingMap.get(4), 
			satisfactionRatingMap.get(5)];
	} else { // Code for all other browsers than IE...
		satisfactionRatingArray = Array.from(satisfactionRatingMap.values()); 
	}
	satisfactionRatingArray.shift(); // Remove the "0" - "..." entry
	/* Set options for satisfaction rating element */
	feedbackPopup.satisfactionRating = {
		isReadonly: false,
		max: 5,
		titles: satisfactionRatingArray,
		hoveringOver: changeSatisfactionValue,
		leaveHover: removeHoverSatisfactionValue,
		enableReset: false
	}
	function changeSatisfactionValue (value) {
		feedbackPopup.giftFeedback.hoverSatisfaction = value;
	}
	function removeHoverSatisfactionValue(){
		delete feedbackPopup.giftFeedback.hoverSatisfaction;
	}
	/* Set giftFeedback object */
	feedbackPopup.giftFeedback = {
		satisfaction: 0,
		receivedOn: reservationDate,
		message: '',
		putBackOnList: false
	}
	/* Convert rating to satisfaction value */
	feedbackPopup.showSatisfactionText = mapRatingOnSatisfaction;
	
	function mapRatingOnSatisfaction () {
		var rating = feedbackPopup.giftFeedback.hoverSatisfaction ? feedbackPopup.giftFeedback.hoverSatisfaction : feedbackPopup.giftFeedback.satisfaction;
		/* Return satisfaction value (text) */
		return satisfactionRatingMap.get(rating);
	}
	/* Save changes in popup */
	feedbackPopup.ok = function () {
		feedbackPopup.giftFeedback.satisfaction = mapRatingOnSatisfaction();
		$uibModalInstance.close({
			giftFeedback: feedbackPopup.giftFeedback, reservator: feedbackPopup.reservator
		});
	};
	/* Cancel popup and discard changes */
	feedbackPopup.cancel = function () {
		$uibModalInstance.dismiss('Cancel');
	};
}])
.controller('receivedWishesPopupController', ['$uibModalInstance', 'receivedWishes', 'receiver', function ($uibModalInstance, receivedWishes, receiver) {
	var _self = this;
		
	_self.wishes = receivedWishes;
	_self.receiver = receiver;
	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	}
}])
.controller('wishPopupCtrl', ['$uibModalInstance', 'cloudinaryService', 'CONFIG', 'user', function ($uibModalInstance, cloudinaryService, CONFIG, user){
	var _self = this;
	console.log("Wish popup is opened");
	_self.wish = {image: CONFIG.defaultImage};
	_self.temporaryPublicID = cloudinaryService.generateRandomPublicID(user._id, CONFIG.temporaryImagePostfix);
	_self.cancel = function () {
		// Delete temporary cloudinary image on cancel in wish create popup
		// Check for CONFIG.temporaryImagePostfix on end of name to make sure that only temporary images are deleted (eg. edit flow will use this popup too)
		// This code should stay in popupCtrl, because on reuse of this popup you want this code to work on every popup implementation.
		if (_self.wish && _self.wish.image && _self.wish.image.public_id.slice(-CONFIG.temporaryImagePostfix.length) === CONFIG.temporaryImagePostfix) {
			cloudinaryService.deleteImage(_self.wish.image.public_id, function () {
				console.info("Temporary image on cloudinary deleted");
				$uibModalInstance.dismiss('cancel');
			});
		} else {
			$uibModalInstance.dismiss('cancel');
		}
	}
	_self.ok = function (){
		$uibModalInstance.close(_self.wish);
	}
}]);