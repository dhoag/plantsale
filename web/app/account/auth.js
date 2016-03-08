(function(){
    var mod = angular.module("auth-mod", ["api-mod", "LocalStorageModule"]);
    Auth.$inject = [ "API", "UrlGenerator", "localStorageService"];
    mod.service("Auth", Auth);
    function Auth(API, UrlGenerator, localStorageService){
        return {
            login: login,
            logout: logout,
            getUser: getUser,
            register: register,
            isLoggedIn: isLoggedIn
        };
        function isLoggedIn(){
            return API.getAuthToken() != null;
        }
        function postApi(path, data) {
            return API.$post(path, data)
                .then(function (result) {
                    localStorageService.set('user', data.email);
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
        function logout(){
            API.setAuthToken(null);
            localStorageService.remove('user');
        }
        function getUser(){
            return localStorageService.get('user');
        }
    }
})();
