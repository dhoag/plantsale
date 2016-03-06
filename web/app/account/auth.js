(function(){
    var mod = angular.module("auth-mod", ["api-mod"]);
    Auth.$inject = [ "API", "UrlGenerator"];
    mod.service("Auth", Auth);
    function Auth(API, UrlGenerator){
        return {
            login: login,
            register: register
        };
        function postApi(path, data) {
            return API.$post(path, data)
                .then(function (result) {
                    API.setAuthToken(result.data.token);
                })
                .catch(function (result) {
                    console.log(result);
                });
        }
        function getData(email, password){
            return {
                "email":email,
                "password":password
            };
        }
        function login(email, password){
            var data = getData(email, password);
            return postApi(UrlGenerator.auth.login(),data);
        }
        function register(email, password){
            var data = getData(email, password);
            return postApi(UrlGenerator.auth.register(),data);
        }
    }
})();