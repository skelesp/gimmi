angular.module('wishlist.receiver', [
	'gimmi.models.wishlist',
	'gimmi.models.person',
	'gimmi.authentication'
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
			.state('gimmi.person.register', {
				url: '/person/register',
				views: {
					'content@' : {
						templateUrl: 'app/people/register.tmpl.html',
						controller: 'registerCtrl as registerCtrl'
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
			self.test = "";

			// Call login from service
			AuthService.authenticate(self.email, self.password)
				.then(function(token){
					$localStorage.token = token;
					self.test = "Succesvol ingelogd met " + AuthService.getCurrentPerson.email;
					self.email = "";
					self.password = "";
					//TODO: wijzig "receiverID" variabele
					$state.go('gimmi.wishlist',{receiverID: "1"});
				})
				.catch(function(){
					self.error = true;
					self.errorMessage = "Invalid username / password";
					self.disabled = false;
					self.email = "";
					self.password = "";
				});

		}
	})
	.controller('logoutCtrl', function(){

	})
	.controller('registerCtrl', function(){

	})
	.controller('receiverCtrl', function($scope, $state, receiverModel) {
		var receiverCtrl = this;

		receiverModel.getReceivers()
			.then(function(receivers) {
				receiverCtrl.receivers = receivers;
			});

		receiverCtrl.showWishlist = function(keyEvent, selected) {
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
