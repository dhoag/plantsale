(function() {
	'use strict';
 
	var app = angular.module('plantsale', [ 'ngRoute', 'account-mod', 'site-mod', 'LocalStorageModule' ]);

	app.config(["$routeProvider", "$locationProvider", "localStorageServiceProvider",
		function ($routeProvider, $locationProvider, localStorageServiceProvider ) {

			$locationProvider.html5Mode(true).hashPrefix("!");

			$routeProvider
				.when("/404", {templateUrl: "app/components/404.html"})
				.when("/", {
					templateUrl: "app/account/login.html",
					controller: "Account",
					controllerAs: "vm"
				})
				.otherwise({redirectTo: '/'});

              localStorageServiceProvider
                .setPrefix('plantSale');
		}
	]);

})();
