(function(){
    var mod = angular.module("account-mod", ["auth-mod"]);

    Account.$inject = ["$scope", "Auth", "$location", "$interval"];
    mod.controller("Account", Account);

    function Account($scope, Auth, $location, $interval){
        var vm = this;
        vm.creds = { email: "", password: "" };
        vm.login = login;
        vm.register = register;
        vm.logout = logout;
        vm.timeRemaining = 0;

        initialize();

        var deadline = '2016-04-08';
        var timeinterval;
        updateClock();
        startClock();

        function updateClock(){
            var t = getTimeRemaining(deadline);
            vm.timeRemaining = '' + t.days + ' days, ' +
                 t.hours + ' hours '+ t.minutes + ' minutes ' + t.seconds + ' seconds';
            if (t.total <= 0) {
                $interval.cancel(timeinterval);
            }
        }
        function startClock() {
            timeinterval = $interval( updateClock, 1000);
        }

        function getTimeRemaining(endtime) {
            var t = Date.parse(endtime) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }


        function initialize(){
            $scope.loggedIn = Auth.isLoggedIn();
            vm.user = Auth.getUser();
            if(vm.user)
                vm.email = vm.user.email;
        }
        function register(){
            Auth.register(vm.creds)
                .then(function(ex){
                    initialize();
                })
        }
        function login(){
            Auth.login(vm.creds)
                .then(function(ex){
                    initialize();
                    $location.path("/order");
                })
                .catch(function(ex){
                    console.log(ex);
                    toastr.error("Failed to sign in. Invalid user id or password.")
                })
        }
        function logout(){
            Auth.logout();
            initialize();
            $location.path("/");
        }
    }
})();
