(function(){
    var mod = angular.module("account-mod", ["auth-mod"]);
    Account.$inject = ["Auth"];
    mod.controller("Account", Account);
    function Account(Auth){
        var vm = this;
        vm.creds = { email: "", password: "" };
        vm.login = login;
        function login(){
            Auth.login(vm.creds)
                .success(function(ex){
                    console.log("Success!");
                })
        }
    }
})();