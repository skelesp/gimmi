angular.module('Gimmi', [
	'ui.bootstrap',
	'ngAnimate',
	'ui.router',
	'wishlist',
	'wishlist.wish',
	'wishlist.receiver'
])
	.config(function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('gimmi', {
				url: '',
				abstract: true
			})
		;
		$urlRouterProvider.otherwise('/');
	})
;
