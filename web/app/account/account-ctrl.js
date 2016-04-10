(function(){
    var mod = angular.module("account-mod", ["auth-mod"]);

    Account.$inject = ["$scope", "Auth", "$location"];
    mod.controller("Account", Account);

    function Account($scope, Auth, $location){
        var vm = this;
        vm.creds = { email: "", password: "" };
        vm.login = login;
        vm.register = register;
        vm.logout = logout;

        initialize();

        function initialize(){
            $scope.loggedIn = Auth.isLoggedIn();
            vm.user = Auth.getUser();
            if(vm.user)
                vm.email = vm.user.email.trim();
        }
        function register(){
            Auth.register(vm.creds)
                .then(function(ex){
                    initialize();
                    $location.path("/order");
                })
                .catch(function(ex){
                    if(ex.data.detail){
                        toastr.error(ex, "Account already exists.");
                    }
                    else {
                        toastr.error(ex, "Failed to register account");
                    }
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
