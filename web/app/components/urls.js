(function(){
    var apiMod = angular.module("api-mod");
    apiMod.service("UrlGenerator", UrlGenerator);
    UrlGenerator.$inject = ["$location"];
    function UrlGenerator($location){
        var urls = {};
        initUrls(urls);
        return urls;

        function initUrls(urls){
            var apiRoot = "http://localhost:8000/api/";
            if( /millst/.test($location.host()) ){
                 apiRoot = "/api/";
            }
            urls.inventory = {
                plants: function(){ return apiRoot + "inventory/"},
                totals: function(){ return apiRoot + "totals/"}
            };
            urls.auth = {
                login : function(){ return apiRoot + "login/" },
                register: function(){ return apiRoot + "register/" }
            };
            urls.user = {
                account: function(id){ return apiRoot + "account/" + id + "/" },
                orders: function(id){ return apiRoot + "order/"},
                order : function(id){
                    return apiRoot + "order/" + id + "/";
                },
                pay: function(id){ return apiRoot + "order/pay/" + id + "/" },
                addItem: function(){ return apiRoot + "order/items" },
                updateItem: function(id){ return apiRoot + "order/item/" + id + "/" },
                allOrders: function(){ return apiRoot + "orders/" }
            }
        }
    }
})();
