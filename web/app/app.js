(function() {
	'use strict';
 
	var app = angular.module('plantsale', ['ngRoute', 'account-mod', 'site-mod' ]);

	app.config(["$routeProvider", "$locationProvider",
		function ($routeProvider, $locationProvider) {

			$locationProvider.html5Mode(true).hashPrefix("!");

			$routeProvider
				.when("/404", {templateUrl: "app/components/404.html"})
				.when("/", {
					templateUrl: "app/account/login.html",
					controller: "Account",
					controllerAs: "vm"
				})
				.otherwise({redirectTo: '/'});

		}
	]);

})();
