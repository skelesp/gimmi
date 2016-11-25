angular.module('Gimmi', [
	'ui.bootstrap',
	'ngAnimate',
	'ngStorage',
	'ui.router',
	'wishlist',
	'wishlist.wish',
	'wishlist.receiver'
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider){
		$stateProvider
			.state('gimmi', {
				url: '/',
				views: {
					'receiverSearch@': {
						controller: 'receiverCtrl as receiverCtrl',
						templateUrl: 'app/people/receiver/receiverSearch.tmpl.html'
					},
					'content@': {
						controller: 'wishlistCtrl as wishlistCtrl',
						templateUrl: 'app/intro.tmpl.html'
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
	})
;
