angular.module('wishlist.receiver', [
	'gimmi.models.wishlist',
	'gimmi.models.person',
	'gimmi.authentication',
	'gimmi.person'
])
	.config(function($stateProvider){
		$stateProvider
			.state('gimmi.login', {
				url: 'login',
				views: {
					'receiverSearch@': {
						templateUrl: 'app/people/receiver/login.tmpl.html',
						controller:'loginCtrl as loginCtrl'
					}
				}
			})
			.state('gimmi.person',{
				url: 'person/:personID',
			})
			.state('gimmi.register_person', {
				url: 'registration',
				views: {
					'receiverSearch@' : {
						templateUrl: 'app/people/receiver/person_registration.tmpl.html',
						controller: 'personRegistrationCtrl as personRegistrationCtrl'
					}
				}
			})
		;
	})
	.controller('loginCtrl', function($localStorage, $state, $scope, UserService){
		var self = this;

		self.isLoggedIn = function(){
			return UserService.isLoggedIn();
		}

		self.login = function() {
			// Set variables to detect errors
			self.error = false;
			self.disabled = false;
			self.infoMessage = "";

			// Call login from service
			UserService.authenticate(self.email, self.password)
				.then(function(user){
					console.log("Succesvol ingelogd met ", UserService.getCurrentUser());
					$scope.$emit('login', user);
					$scope.$broadcast('login', user);
					$state.go('gimmi.wishlist',{receiverID: user._id});
				})
				.catch(function(){
					self.error = true;
					self.errorMessage = "Invalid username / password";
					self.disabled = false;
				});
		}


	})
	.controller('logoutCtrl', function(){

	})
	.controller('personRegistrationCtrl', ["$state", "$localStorage", "$scope", "PersonService", function($state, $localStorage, $scope, PersonService){
		var self = this;

		// Set variables to detect errors
		self.error = false;
		self.disabled = false;
		self.infoMessage = "";

		self.register = function(newPerson){
			PersonService.register(newPerson)
				.then(
					function(token){
						$localStorage.token = token;
						self.infoMessage = "Registratie voltooid!";
						var user = PersonService.getPersonFromToken(token);
						$scope.$emit('login', user);
						$scope.$broadcast('login', user);
						$state.go('gimmi.wishlist',{receiverID: user._id});
					},
					function(err){
						self.error = true;
						self.errorMessage = "Registration failed due to '"+err+"'";
						self.disabled = false;
					}
			);
		}

	}])
	.controller('receiverSearchCtrl', ['$scope', '$state', 'receiverModel', function($scope, $state, receiverModel) {
		var receiverSearchCtrl = this;

		receiverModel.getReceivers()
			.then(function(receivers) {
				receiverSearchCtrl.receivers = receivers;
			});

		$scope.$on('login', function(_, user){
			console.log("login");
			receiverModel.getReceivers()
				.then(function(receivers) {
					receiverSearchCtrl.receivers = receivers;
				});
		});

		$scope.$on('logout', function(){
				console.log("logout");
				receiverSearchCtrl.receivers = null;
		});

		receiverSearchCtrl.showWishlist = function(keyEvent, selected) {
		  if (keyEvent.which === 13){
				console.log(selected);

				receiverModel.getReceiverByName(selected.name)
					.then(function(receiver){
						$state.go('gimmi.wishlist',{receiverID: receiver.id});
					});
				$scope.selected = null;
			}
		};

	}])
;
