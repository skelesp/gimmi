angular.module('Gimmi', [
	'ui.bootstrap',
	'ngAnimate',
	'ngStorage',
	'ui.router',
	'wishlist',
	'wishlist.wish',
	'wishlist.receiver'
])
	.config(function($stateProvider, $urlRouterProvider){
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
	})
;
