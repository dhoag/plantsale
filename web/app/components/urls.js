(function(){
    var apiMod = angular.module("api-mod");
    apiMod.service("UrlGenerator", UrlGenerator);
    function UrlGenerator(){
        var urls = {};
        initUrls(urls);
        return urls;

        function initUrls(urls){
            //var apiRoot = "/api/";
            var apiRoot = "http://localhost:8000/api/";
            urls.inventory = {
                plants: function(){ return apiRoot + "inventory/"}
            };
            urls.auth = {
                login : function(){ return apiRoot + "login/" },
                register: function(){ return apiRoot + "register/" }
            };
        }
    }
})();
