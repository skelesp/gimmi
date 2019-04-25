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
				},
				resolve: {
					invitedPerson: ['$rootScope', 'PersonService', function($rootScope, PersonService){
						// Als resolve niet ok is, gaat pagina in fout... Hoe oplossen?
						return PersonService.findByEmail($rootScope.attemptedEmail)
							.then(function(person){
								return person
							}, function(err){
								return undefined;
							});
					}]
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
	.controller('loginCtrl', function ($location, $rootScope, $localStorage, $state, $scope, UserService, Flash, invitedPerson){
		var self = this;

		if ( UserService.isLoggedIn()) {
			console.log("Gebruiker is al ingelogd --> redirect opgeroepen voor " + UserService.currentUser._id);
			redirectAfterAuthentication(UserService.currentUser._id);
		}

		self.saveMailInRootScope = function() {
			$rootScope.attemptedEmail = self.email;
		}
		

		if ($rootScope.attemptedEmail) {
			self.email = $rootScope.attemptedEmail;
			if (!invitedPerson) {
				console.info("U bent uitgenodigd, maar u hebt nog geen account --> Redirect naar registratiepagina");
				$state.go('gimmi.register_person');
			};
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
			// Check if there was a page the user requested before logging in
			// This page is stored in "$rootScope.returnToState" with stateParams in "$rootScope.returnToStateParams"
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
			// Check if there was a url the user requested before logging in (eg. clicked a link in an email and wasn't logged in)
			} else if ($rootScope.attemptedUrl) {
				console.info("redirect to " + $rootScope.attemptedUrl)
				$location.path($rootScope.attemptedUrl); // go to the url
				delete $rootScope.attemptedUrl;
				delete $rootScope.attemptedEmail;
			// If the logged in user hasn't requested a specific page before logging in, he/she will be directed to the "user dashboard"
			} else {
				$state.go('gimmi.userdashboard', { userID: userID });
			}
		}

	})
	.controller('personRegistrationCtrl', ["$rootScope", "$location", "$state", "$localStorage", "$scope", "PersonService", "UserService", "receiverModel", function ($rootScope, $location, $state, $localStorage, $scope, PersonService, UserService, receiverModel){
		var self = this;

		// Set variables to detect errors
		self.error = false;
		self.disabled = false;
		self.infoMessage = "";

		self.saveMailInRootScope = function() {
			console.log("nieuwe waarde = " + self.newPerson.email);
			$rootScope.attemptedEmail = self.newPerson.email;
		}

		if ($rootScope.attemptedEmail) {
			self.newPerson = { email: $rootScope.attemptedEmail};
		}
		if ($rootScope.attemptedUrl || $rootScope.returnToState) {
			// Search for a person's name based on the id in the URL ('/wishlist/:id') which was sent in the invitation mail
			id = $rootScope.returnToState ? $rootScope.returnToStateParams.receiverID : $rootScope.attemptedUrl.split('/')[2];
			PersonService.getNameById(id)
				.then(function(person){
					self.invitedFor = person.fullName;
				});
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
			// Check if there was a page the user requested before logging in
			// This page is stored in "$rootScope.returnToState" with stateParams in "$rootScope.returnToStateParams"
			if ($rootScope.returnToState) {
				if ($rootScope.returnToState === "gimmi.wishlist.send") {
					$state.go($rootScope.returnToState, { receiverID: userID });
				} else if ($rootScope.returnToState === "gimmi.wishlist" && !$rootScope.returnToStateParams.receiverID) {
					$state.go($rootScope.returnToState, { receiverID: userID });
				} else {
					$state.go($rootScope.returnToState, $rootScope.returnToStateParams);
				}
				delete $rootScope.returnToState;
				delete $rootScope.returnToStateParams;
				delete $rootScope.attemptedEmail;
				// Check if there was a url the user requested before logging in (eg. clicked a link in an email and wasn't logged in)
			} else if ($rootScope.attemptedUrl) {
				console.info("redirect to " + $rootScope.attemptedUrl)
				$location.path($rootScope.attemptedUrl); // go to the url
				delete $rootScope.attemptedUrl;
				delete $rootScope.attemptedEmail;
				// If the logged in user hasn't requested a specific page before logging in, he/she will be directed to the "user dashboard"
			} else {
				$state.go('gimmi.userdashboard', { userID: userID });
			}
		}

	}])
	.controller('receiverSearchCtrl', ['$scope', '$state', 'receivers', 'receiverModel', function($scope, $state, receivers, receiverModel) {
		var _self = this;
		
		_self.receivers = receivers;

		$scope.$on('receivers:update', function (_, receivers) {
			_self.receivers = receivers;
			console.info("receivers are updated");
		})

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
