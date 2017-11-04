angular.module('Gimmi', [
	'ui.bootstrap',
	'ngAnimate',
	'ngStorage',
	'ui.router',
	'gimmi.models.receiver',
	'wishlist',
	'wishlist.wish',
	'wishlist.receiver',
	'landingPage',
	'ngFlash',
	'ng.deviceDetector'
])
.run(['$rootScope', '$window', 'CONFIG', 'UserService', function ($rootScope, $window, config, UserService) {

	console.info('Start running app');
	$window.fbAsyncInit = function () {
		// Executed when the SDK is loaded

		FB.init({

			/*
				The app id of the web app;
				To register a new app visit Facebook App Dashboard
				( https://developers.facebook.com/apps/ )
			*/

			appId: config.fbID,

			/*
				Adding a Channel File improves the performance
				of the javascript SDK, by addressing issues
				with cross-domain communication in certain browsers.
			*/

			channelUrl: 'app/channel.html',

			/*
				Set if you want to check the authentication status
				at the start up of the app
			*/

			status: true,

			/*
				Enable cookies to allow the server to access
				the session
			*/

			cookie: true,

			/* Parse XFBML */

			xfbml: true,

			/* Set the API version */

			version: 'v2.10',

			autoLogAppEvents: true
		});
		FB.AppEvents.logPageView();
		console.info("FB SDK initiated");

		UserService.checkLoginStatus();

	};

	(function (d) {
		// load the Facebook javascript SDK

		var js,
			id = 'facebook-jssdk',
			ref = d.getElementsByTagName('script')[0];

		if (d.getElementById(id)) {
			return;
		}

		js = d.createElement('script');
		js.id = id;
		js.async = true;
		js.src = "//connect.facebook.net/nl_NL/sdk.js";

		ref.parentNode.insertBefore(js, ref);

	}(document));

}])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $uibTooltipProvider, FlashProvider){
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
					templateUrl: 'app/intro.tmpl.html',
					controller: 'landingPageCtrl',
					controllerAs: 'lp'
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

	//Flash message config
	FlashProvider.setTimeout(5000);
	FlashProvider.setShowClose(true);
	FlashProvider.setTemplatePreset('transclude');
})
.controller('ApplicationCtrl', ['$scope', '$state', 'UserService', 'deviceDetector', 'Flash', function($scope, $state, UserService, device, Flash){
	var self = this;

	self.currentUser = UserService.getCurrentUser();
	self.onMobileDevice = device.isMobile(); // zit dit niet beter als een constant in Angular?
	
	$scope.$on('login', function(_, user){
		self.currentUser = user;
	})

	self.logout = function(){
		UserService.logout();
		self.currentUser = null;
		$scope.$broadcast('logout');
		$state.go('gimmi.login');
		console.info("User logged out from Gimmi");
	};

	self.logOutFacebook = function() {
		UserService.logOutFacebook();
		self.logout();
	}
}])
;
