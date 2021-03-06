(function() {
	'use strict';
 
	var app = angular.module('plantsale', [ 'ngRoute', 'account-mod', 'stripe-svc',
		'site-mod', 'LocalStorageModule', 'inventory-svc', 'order-svc' ]);

	app.config(["$routeProvider", "$locationProvider", "localStorageServiceProvider",
		function ($routeProvider, $locationProvider, localStorageServiceProvider ) {

			$locationProvider.html5Mode(true).hashPrefix("!");

			$routeProvider
				.when("/404", {templateUrl: "app/components/404.html"})
				.when("/order", {
					templateUrl: "app/order/plants.html",
					controller: "OrderBuilder",
					controllerAs: "vm"
				})
				.when("/print", {
					templateUrl: "app/order/all-details.html",
					controller: "All",
					controllerAs: "vm"
				})
				.when("/orders", {
					templateUrl: "app/order/all.html",
					controller: "All",
					controllerAs: "vm"
				})
				.when("/", {
					templateUrl: "app/order/plants.html",
					controller: "OrderBuilder",
					controllerAs: "vm"
				})
				.when("/summary",{
					templateUrl: "app/order/summary.html",
					controller: "Summary",
					controllerAs: "vm"
				})
				.otherwise({redirectTo: '/'});

              localStorageServiceProvider
                .setPrefix('plantSale');
		}
	]);

})();
