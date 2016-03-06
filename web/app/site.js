(function () {
    var siteMod = angular.module('site-mod', []);
    siteMod.controller("Site", Site);

    Site.$inject = [ "$scope", "$rootScope", "$route" ];

    function Site( $scope, $rootScope, $route) {
        $scope.$route = $route;

        $scope.scrollTop = function () {
            $( document ).scrollTop( 0 );
        };

        toastr.options.timeOut = 1500;
        toastr.options.preventDuplicates = true;

        $rootScope.$on("$routeChangeSuccess", function (event, data) {
            if (data && data.$$route && data.$$route.controller) {
                $rootScope.controller = data.$$route.controller;
            }
        });
    }
})();
