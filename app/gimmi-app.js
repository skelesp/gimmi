angular.module('Gimmi', [
	'ui.bootstrap',
	'ngAnimate',
	'ngStorage',
	'ui.router',
	'gimmi.models.receiver',
	'gimmi.person',
	'wishlist',
	'wishlist.wish',
	'wishlist.receiver',
	'landingPage',
	'ngFlash',
	'ng.deviceDetector',
	'gimmi.communication',
	'gimmi.reporting',
	'gimmi.config',
	'cloudinary',
	'cloudinaryModule',
	'userdashboard'
])
.run(['$rootScope', '$window', '$state', '$stateParams', '$location', '$uibModalStack', 'Flash', 'CONFIG', 'UserService', function ($rootScope, $window, $state, $stateParams, $location, $uibModalStack, Flash, config, UserService) {

	console.info('Start running app');
	/*******************/
	/* EVENT LISTENERS */
	/*******************/
	//Listen on state changes and check authentication	
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (toState.authenticate && !UserService.isLoggedIn()) {

			// Save data of original URL
			$rootScope.returnToState = toState.name;
			$rootScope.returnToStateParams = toParams;
			if ($location.search().e) { // Save the email on which the user has received an invitation (= QS "e" in invitation link)
				$rootScope.attemptedEmail = $location.search().e;
				$state.go('gimmi.login');
			} else {
				$state.go('gimmi.register_person');
			}

			// Save 
			console.log("Need login for restricted access route --> redirect to login page");
			event.preventDefault();
			Flash.create("info", "Om de gevraagde pagina te kunnen bekijken moet je eerst inloggen/registreren.");
		}
	});

	$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
		event.preventDefault();
		console.error("Error in state '" + toState.name + "'");
		console.error(error);
		$state.go(fromState.name, fromParams);
		Flash.create("danger", "De gevraagde pagina kan niet getoond worden.");
	});

	// Prevent browser-back to change page when modal is openend
	// Source: https://stackoverflow.com/questions/23762323/is-there-a-way-to-automatically-close-angular-ui-bootstrap-modal-when-route-chan/23766070#23766070
	$rootScope.$on('$locationChangeStart', function ($event) {
		var openedModal = $uibModalStack.getTop();
		if (openedModal) {
			if (!!$event.preventDefault) {
				$event.preventDefault();
			}
			if (!!$event.stopPropagation) {
				$event.stopPropagation();
			}
			$uibModalStack.dismiss(openedModal.key);
		}
	});

	/************/
	/* FACEBOOK */
	/************/
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
.config(['cloudinaryProvider', 'cloudinaryServiceProvider', 'CONFIG', function (cloudinaryProvider, cloudinaryServiceProvider, CONFIG) {
	/* Config for Angular SDK of Cloudinary (cl-image directive) */
	cloudinaryProvider
		.set("cloud_name", CONFIG.cloudinary.cloudName)
		.set("secure", true)
		.set("upload_preset", CONFIG.cloudinary.uploadPreset);

	cloudinaryServiceProvider
		.setOption("cloudName", CONFIG.cloudinary.cloudName)
		.setOption("uploadPreset", CONFIG.cloudinary.uploadPreset)
		.setOption("apiKey", CONFIG.cloudinary.apiKey)
		.setOption("googleApiKey", CONFIG.googleApiKey)
		.setOption("language", CONFIG.cloudinary.language)
		//https://cloudinary.com/documentation/upload_widget#localization
		.setOption("text", CONFIG.cloudinary.text);
}])
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$uibTooltipProvider', '$compileProvider', 'FlashProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $uibTooltipProvider, $compileProvider, FlashProvider){
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
					templateUrl: 'app/landingPage.tmpl.html',
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

	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|fb-messenger|whatsapp):/);

	$httpProvider.interceptors.push(['$location', '$rootScope', '$q', '$localStorage', '$injector', 'CONFIG', function($location, $rootScope, $q, $localStorage, $injector, CONFIG) {
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
					if ($location.path() !== "/login") { // Save the URL to which an unauthorised user wanted to navigate
						$rootScope.attemptedUrl = $location.path();
						if ($location.search().e) { // Save the email on which the user has received an invitation (= QS "e" in invitation link)
							$rootScope.attemptedEmail = $location.search().e;
						}
					}					
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
	FlashProvider.setTimeout(4000);
	FlashProvider.setShowClose(true);
	FlashProvider.setTemplatePreset('transclude');
}])
.controller('ApplicationCtrl', ['$scope', '$rootScope', '$state', 'UserService', 'deviceDetector', 'Flash', function ($scope, $rootScope, $state, UserService, device, Flash){
	var self = this;

	self.currentUser = UserService.getCurrentUser();
	$scope.$watch(function(){ // When currentUser changes, it needs to be refreshed. (after update of person details/accounts)
		return UserService.getCurrentUser();
	}, function (newCurrentUser) {
		console.log('Current user changed');
		self.currentUser = newCurrentUser;
	});
	self.onMobileDevice = device.isMobile(); // zit dit niet beter als een constant in Angular?
	
	$scope.$on('login', function(_, user){
		self.currentUser = user;
		console.log("user is logged in", user);
	})

	self.logout = function(){
		UserService.logout();
		$scope.$broadcast('logout');
	};

	self.logOutFacebook = function() {
		UserService.logOutFacebook();
		self.logout();
	};

	self.clearAttemptedEmail = function() {
		console.log("attemptedEmail deleted");
		delete $rootScope.attemptedEmail;
	}

}])
;
