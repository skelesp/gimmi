﻿angular.module('wishlist', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver',
	'wishlist.receiver',
	'gimmi.config',
	'gimmi.authentication',
	'wishlist.wish',
	'gcse',
	'ngclipboard'
])
.config(function($stateProvider){
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
					controller: 'createWishCtrl as createWishCtrl'
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
})
.controller('wishlistCtrl', ['$stateParams', 'wishModel', 'receiverModel', 'UserService', 'wishlist', 'currentReceiver',
	function wishlistCtrl($stateParams, wishModel, receiverModel, UserService, wishlist, currentReceiver){
	var _self = this;

	_self.currentUserID = UserService.getCurrentUser().id;
	_self.currentReceiver = currentReceiver;
	_self.wishes = wishlist.wishes;
	
	if (currentReceiver) {
		_self.userIsReceiver = UserService.userIsReceiver(currentReceiver._id);
	} else {
		_self.userIsReceiver = false;
	}
}])
.controller('wishCtrl', ['$stateParams', '$uibModal', 'wishModel', 'receiverModel', 'UserService', function($stateParams, $uibModal, wishModel, receiverModel, UserService) {
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

	_self.reservedByUser = function(reservatorID){
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

	function copy(wish){
		var userID = UserService.getCurrentUser()._id;
		var newWish = {};
		newWish.title = wish.title;
		newWish.image = wish.image;
		newWish.url = wish.url;
		newWish.price =  wish.price;
		wishModel.createWish(newWish, userID, userID);
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
				}
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

	function addReservation (wish, userID, reason) {
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
	//TODO: Zou al in de DB call uit Mongo moeten meegegeven worden in het object
	function getReservationStatus (wish) {
		var reservationStatus = "unreserved";
		if (wish.reservation) {
			reservationStatus = "reserved";
		}
		return reservationStatus;
	}
	_self.reservationStatus = getReservationStatus;
	_self.copy = copy;
	_self.edit = edit;
	_self.deleteWish = deleteWishVerification;
	_self.addReservation = addReservation;
	_self.deleteReservation = deleteReservation;
}])
.controller('editPopupCtrl', function($uibModalInstance, wish) {
	var _self = this;

	_self.wish = wish;
	_self.ok = function () {
		$uibModalInstance.close(wish);
	};
	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
})
.controller('wishReservationPopupCtrl', function($uibModalInstance, wish) {
	var _self = this;
	var reservation = {amount: 1, reason: ''};
	_self.reservation = reservation;
	_self.wishTitle = wish.title;
	_self.ok = function () {

		$uibModalInstance.close(reservation);
	};
	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
})
.controller('deletePopupCtrl', function ($uibModalInstance, wish){
	var _self = this;
	_self.wishTitle = wish.title;
	_self.ok = function () {
		$uibModalInstance.close(wish);
	};

	_self.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
})
.controller('createWishCtrl', ['$state', '$stateParams', '$uibModal', '$window', 'CONFIG', 'wishModel', 'receiverModel', 'UserService', 'gcseService',
	function ($state, $stateParams, $uibModal, $window, CONFIG, wishModel, receiverModel, UserService, gcseService){
	/* Initialize variables */
	var _self = this;
	var defaultWish = {
		title: '',
		price: '',
		url: '',
		image: ''
	};
	
	/* Available in view */
	_self.newWish = angular.copy(defaultWish);
	_self.noImages = true;
	_self.defaultImage = CONFIG.defaultImage;
	_self.reset = resetForm;
	_self.createWish = createWish;
	_self.currentReceiverID = receiverModel.getCurrentReceiver()._id;
	_self.currentUserID = UserService.getCurrentUser()._id;
	
	/* Functions in createWishCtrl */
	function returnToWishes(){
		$state.go('gimmi.wishlist', {receiverID: $stateParams.receiverID })
	}

	function createWish(wish, receiverID, userID) {
		if (!wish.image) {
			wish.image = '';
		}
		wishModel.createWish(wish, receiverID, userID);
		resetForm();
		returnToWishes();
	}

	function resetForm() {
		_self.newWish = angular.copy(defaultWish);
		_self.googleImages = [];
	}

	resetForm();

	_self.goToPrice = function(){
		$window.document.getElementById('newWishPrice').focus();
	}
	_self.goToImage = function () {
		// Hoe de GSCE directive oproepen?
	}
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
				var mailUrl = self.url + '?e=' + to
				var mailHtml = '<html><body>Beste,<br />' + receiver.firstName + " " + receiver.lastName + ' nodigt u uit om zijn/haar wensenlijst op Gimmi te bekijken.<br />Klik <a href="' + mailUrl + '">hier</a> of kopieer de link: ' + mailUrl + '<br /><p><i>Kies het perfecte cadeau voor ' + receiver.firstName + ' (en registreer u om zelf een wishlist aan te maken!).</i></p><br /><p>Gimmi</p><br /><p>The perfect gift</p></body></html>'
				mail = {
					to: to,
					subject: receiver.firstName + " " + receiver.lastName + " nodigt u uit op zijn/haar wensenlijst op Gimmi.",
					html: mailHtml
				}
				
				CommunicationService.sendMail(mail).then(function(mailResponse){
					console.log(mailResponse);
					var message = "Uw mail werd verzonden.";
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
		var message = "De link werd gekopieerd naar het klembord. U kan deze nu overal plakken.";
		var flashID = Flash.create('success', message);
		self.showCopyTooltip = true;
	}
}])
	.controller("invitationPopupCtrl", ['$uibModalInstance', function ($uibModalInstance){
	var self = this;

	self.mailTo;
	self.ok = function(){
		$uibModalInstance.close(self.mailTo);
	};

	self.cancel = function(){
		$uibModalInstance.dismiss('Cancel');
	};
}])
;
