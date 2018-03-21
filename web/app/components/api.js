(function() {

    var apiMod = angular.module('api-mod');
    Api.$inject = [ "$http", "$rootScope", "$q", "localStorageService" ];
    apiMod.factory("API", Api);

    function Api( $http, $rootScope, $q, localStorageService ) {
        function getAuthToken() {
            return localStorageService.get("authToken");
        }

        function removeAuthToken() {
            localStorageService.remove("authToken");
        }

        function setAuthToken(token) {
            localStorageService.set("authToken", token);
        }

        function apiRequest(method, path, requestData) {
            var authToken = getAuthToken();
            var headers = ( !!authToken ) ? {"AUTHORIZATION": "Token " + authToken} : {};
            var options = {method: method, url: path, headers: headers, data: requestData || {}};
            if (method === 'get') {
                options.params = options.data;
                delete options.data;
            }
            if (requestData) {
                headers["Content-Type"] = "application/json;charset=utf-8";
            }

            if (method === "postFile") {
                headers["Content-Type"] = undefined;  // To ensure multipart boundary is added
                options.method = "post";
                options.headers = headers;
                options.transformRequest = angular.identity;
            }

            var canceler = $q.defer();
            options.timeout = canceler.promise;
            var promise = $http(options);
            promise.error(function (data, status, headers, config) {
                if (status == 401 || status == 403) {
                    console.log("API unauthorized. " + options.url);
                    localStorageService.remove("authToken");
                    $rootScope.FORBIDDEN = true;
                    return status;
                }

            });
            return promise;
        }


        return {
            $get: function (path, params) {
                return apiRequest("get", path, params || {});
            },
            $post: function (path, requestData) {
                return apiRequest("post", path, requestData);
            },
            $postFile: function (path, requestData) {
                return apiRequest("postFile", path, requestData, "");
            },
            $put: function (path, requestData) {
                return apiRequest("put", path, requestData, "");
            },
            $patch: function (path, requestData) {
                return apiRequest("patch", path, requestData, "");
            },
            $delete: function (path, requestParams) {
                return apiRequest("delete", path, requestParams, "");
            },
            getAuthToken: getAuthToken,
            setAuthToken: setAuthToken,
            removeAuthToken: removeAuthToken
        };

    }
})();

