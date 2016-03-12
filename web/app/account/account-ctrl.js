(function(){
    var mod = angular.module("account-mod", ["auth-mod"]);

    Account.$inject = ["$scope", "Auth"];
    mod.controller("Account", Account);

    function Account($scope, Auth){
        var vm = this;
        vm.creds = { email: "", password: "" };
        vm.login = login;
        vm.register = register;
        vm.logout = logout;

        initialize();

        function initialize(){
            $scope.loggedIn = Auth.isLoggedIn();
            vm.email = Auth.getUser();
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
                })
                .catch(function(ex){
                    console.log(ex);
                    toastr.error("Failed to sign in. Invalid user id or password.")
                })
        }
        function logout(){
            Auth.logout();
            initialize();
        }
    }
})();
