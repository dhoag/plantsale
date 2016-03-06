(function(){
    var mod = angular.module("auth-mod", ["api-mod"]);
    Auth.$inject = [ "API", "UrlGenerator"];
    mod.service("Auth", Auth);
    function Auth(API, UrlGenerator){
        return {
            login: login,
            register: register,
            isLoggedIn: isLoggedIn
        };
        function isLoggedIn(){
            return API.getAuthToken() != null;
        }
        function postApi(path, data) {
            return API.$post(path, data)
                .then(function (result) {
                    API.setAuthToken(result.data.token);
                    return result;
                })
        }
        function login(credentials){
            return postApi(UrlGenerator.auth.login(),credentials);
        }
        function register(credentials){
            return postApi(UrlGenerator.auth.register(),credentials);
        }
    }
})();
