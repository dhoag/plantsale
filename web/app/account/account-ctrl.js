(function(){
    var mod = angular.module("account-mod", ["auth-mod"]);

    Account.$inject = ["$scope", "Auth"];
    mod.controller("Account", Account);

    function Account($scope, Auth){
        var vm = this;
        vm.creds = { email: "", password: "" };
        vm.login = login;
        vm.register = register;

        initialize();

        function initialize(){
            $scope.loggedIn = Auth.isLoggedIn();
        }
        function register(){
            Auth.register(vm.creds)
                .then(function(ex){
                    console.log("Success!");
                })
        }
        function login(){
            Auth.login(vm.creds)
                .then(function(ex){
                    console.log("Success!");
                })
        }
    }
})();
