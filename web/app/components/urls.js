(function(){
    var apiMod = angular.module("api-mod");
    apiMod.service("UrlGenerator", UrlGenerator);
    function UrlGenerator(){
        var urls = {};
        initUrls(urls);
        return urls;

        function initUrls(urls){
            var apiRoot = "/api/";
            urls.auth = {
                login : function(){ return apiRoot + "/login/" },
                register: function(){ return apiRoot + "/register/" }
            };
        }
    }
})();
