angular.module('wishlist.receiver', [
	'gimmi.models.wishlist',
	'gimmi.models.receiver',
	'gimmi.authentication',
	'gimmi.person'
])
	.config(function($stateProvider){
		$stateProvider
			.state('gimmi.login', {
				url: 'login',
				views: {
					'content@': {
						templateUrl: 'app/people/receiver/login.tmpl.html',
						controller:'loginCtrl as loginCtrl'
					}
				}
			})
			.state('gimmi.register_person', {
				url: 'registration',
				views: {
					'content@' : {
						templateUrl: 'app/people/receiver/person_registration.tmpl.html',
						controller: 'personRegistrationCtrl as personRegistrationCtrl'
					}
				}
			})
		;
	})
	.controller('loginCtrl', function($location, $rootScope, $localStorage, $state, $scope, UserService, Flash){
		var self = this;

		self.isLoggedIn = function(){
			return UserService.isLoggedIn();
		}
		if ($rootScope.attemptedEmail) {
			self.email = $rootScope.attemptedEmail;
		}
		self.login = function() {
			// Set variables to detect errors
			self.error = false;
			self.disabled = false;
			self.infoMessage = "";

			// Call login from service
			UserService.authenticate(self.email, self.password)
				.then(function(user){
					redirectAfterAuthentication(user._id);
				})
				.catch(function(){
					self.error = true;
					self.errorMessage = "Invalid username / password";
					self.disabled = false;
				});
		}
		self.logInFacebook = function(){
			UserService.logInFacebook()
				.then(function (user) {
					$scope.$emit('login', user);
					$scope.$broadcast('login', user);
					redirectAfterAuthentication(user._id);
				})
				.catch(function () {
					self.error = true;
					self.errorMessage = "Invalid username / password";
					self.disabled = false;
				});
		}
		self.checkLoginStatus = UserService.checkLoginStatus;
		
		function redirectAfterAuthentication(userID) {
			if ($rootScope.returnToState) {
				if ($rootScope.returnToState === "gimmi.wishlist.send"){
					$state.go($rootScope.returnToState, {receiverID: userID});
				} else if ($rootScope.returnToState === "gimmi.wishlist" && !$rootScope.returnToStateParams.receiverID) {
					$state.go($rootScope.returnToState, { receiverID: userID });
				} else {
					$state.go($rootScope.returnToState, $rootScope.returnToStateParams);
				}
				delete $rootScope.returnToState;
				delete $rootScope.returnToStateParams;
				delete $rootScope.attemptedEmail;
			} else if ($rootScope.attemptedUrl) {
				console.info("redirect to " + $rootScope.attemptedUrl)
				$location.path($rootScope.attemptedUrl);
				delete $rootScope.attemptedUrl;
				delete $rootScope.attemptedEmail;
			} else {
				$state.go('gimmi.wishlist', { receiverID: userID });
			}
		}

	})
	.controller('personRegistrationCtrl', ["$rootScope", "$location", "$state", "$localStorage", "$scope", "PersonService", "UserService", "receiverModel", function ($rootScope, $location, $state, $localStorage, $scope, PersonService, UserService, receiverModel){
		var self = this;

		// Set variables to detect errors
		self.error = false;
		self.disabled = false;
		self.infoMessage = "";

		if ($rootScope.attemptedEmail) {
			self.newPerson = { email: $rootScope.attemptedEmail};
		}

		self.register = function(newPerson){
			PersonService.register(newPerson)
				.then(
					function(token){
						$localStorage.token = token;
						self.infoMessage = "Registratie voltooid!";
						var user = PersonService.getPersonFromToken(token);
						UserService.refreshCurrentUser("token", token);
						$scope.$emit('login', user);
						$scope.$broadcast('login', user);
						receiverModel.refreshReceivers()
							.then(function(receivers) {
								console.info("receivers updated", receivers);
							});
						redirectAfterAuthentication(user._id);
					},
					function(err){
						self.error = true;
						if (err === "User already exists") {
							self.errorMessage = "Er bestaat al een gebruiker met dit emailadres. Gelieve in te loggen met deze email of een ander emailadres te gebruiken.";
						}
						self.disabled = false;
					}
			);
		}

		self.logInFacebook = function () {
			UserService.logInFacebook()
				.then(function (user) {
					$scope.$emit('login', user);
					$scope.$broadcast('login', user);
					redirectAfterAuthentication(user._id);
				})
				.catch(function () {
					self.error = true;
					self.errorMessage = "Invalid username / password";
					self.disabled = false;
				});
		}

		function redirectAfterAuthentication(userID) {
			if ($rootScope.returnToState) {
				$state.go($rootScope.returnToState, $rootScope.returnToStateParams);
				delete $rootScope.returnToState;
				delete $rootScope.returnToStateParams;
				delete $rootScope.attemptedEmail;
			} else if ($rootScope.attemptedUrl) {
				console.info("redirect to " + $rootScope.attemptedUrl)
				$location.path($rootScope.attemptedUrl);
				delete $rootScope.attemptedUrl;
				delete $rootScope.attemptedEmail;
			} else {
				$state.go('gimmi.wishlist', { receiverID: userID });
			}
		}

	}])
	.controller('receiverSearchCtrl', ['$scope', '$state', 'receivers', 'receiverModel', function($scope, $state, receivers, receiverModel) {
		var _self = this;
		
		_self.receivers = receivers;

		$scope.$on('login', function(_, user){
			receiverModel.getReceivers()
				.then(function(receivers) {
					_self.receivers = receivers;
			});
		});

		$scope.$on('logout', function(){
			_self.receivers = null;
		});

		_self.showWishlist = function(keyEvent, selected) {
		  if (keyEvent.which === 13){
				receiverModel.getReceiverByName(selected.fullName)
					.then(function(receiver){
						$state.go('gimmi.wishlist',{receiverID: receiver.id});
				});
				$scope.selected = null;
			}
		};

	}])
;
