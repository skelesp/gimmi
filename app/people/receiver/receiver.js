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
					'content@': {
						templateUrl: 'app/people/receiver/login.tmpl.html',
						controller:'loginCtrl as loginCtrl'
					}
				}
			})
			.state('gimmi.logout', {
				url: 'logout',
				controller: 'logoutCtrl as logoutCtrl'
			})
			.state('gimmi.person',{
				url: 'person/:personID',
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
	.controller('loginCtrl', function($localStorage, $state, AuthService){
		var self = this;

		self.login = function() {
			// Set variables to detect errors
			self.error = false;
			self.disabled = false;
			self.infoMessage = "";

			// Call login from service
			AuthService.authenticate(self.email, self.password)
				.then(function(token){
					$localStorage.token = token;
					self.infoMessage = "Succesvol ingelogd met " + AuthService.getCurrentPerson.email + "("+AuthService.getCurrentPerson._id+")";
					//TODO: wijzig "receiverID" variabele naar _id veld
					$state.go('gimmi.wishlist',{receiverID: "1"});
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
	.controller('personRegistrationCtrl', ["$state", "$localStorage", "PersonService", function($state, $localStorage, PersonService){
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
						$state.go('gimmi.wishlist',{receiverID: PersonService.getPersonFromToken(token)._id});
					},
					function(err){
						self.error = true;
						self.errorMessage = "Registration failed due to '"+err+"'";
						self.disabled = false;
					}
			);
		}

	}])
	.controller('receiverSearchCtrl', function($scope, $state, receiverModel) {
		var receiverSearchCtrl = this;

		receiverModel.getReceivers()
			.then(function(receivers) {
				receiverSearchCtrl.receivers = receivers;
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

	})
;
