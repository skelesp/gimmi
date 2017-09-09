angular.module('Gimmi', [
	'ui.bootstrap',
	'ngAnimate',
	'ngStorage',
	'ui.router',
	'gimmi.models.receiver',
	'wishlist',
	'wishlist.wish',
	'wishlist.receiver'
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $uibTooltipProvider){
		$stateProvider
			.state('gimmi', {
				url: '/',
				views: {
					'receiverSearch@gimmi': {
						controller: 'receiverSearchCtrl as receiverSearchCtrl',
						templateUrl: 'app/people/receiver/receiverSearch.tmpl.html',
						resolve: {
							receivers: ['receiverModel', function(receiverModel){
								return receiverModel.getReceivers();
							}]
						}
					},
					'content@': {
						templateUrl: 'app/intro.tmpl.html'
					},
					'navbar@': {
						templateUrl: 'app/navigation/navbar.tmpl.html'
					}
				}
			})
		;
		$urlRouterProvider.otherwise('/');

		$httpProvider.interceptors.push(['$q', '$localStorage', '$injector', function($q, $localStorage, $injector) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401) {
                      $injector.get('$state').go('gimmi.login');
                    } else if (response.status === 403) {
											// TODO: doe iets als de gebruiker een actie heeft uitgevoerd die niet toegestaan is
										}
                    return $q.reject(response);
                }
            };
		}]);
		
		$uibTooltipProvider.options({
			'placement' : 'bottom-left',
			'popupCloseDelay' : '10' 
		});
	})
	.controller('ApplicationCtrl', ['$scope', '$state', 'UserService', function($scope, $state, UserService){
		var self = this;

		self.currentUser = UserService.getCurrentUser();

		$scope.$on('login', function(_, user){
			self.currentUser = user;
		})

		self.logout = function(){
      UserService.logout();
      self.currentUser = null;
			$scope.$broadcast('logout');
      $state.go('gimmi.login');
    };
	}])
;
