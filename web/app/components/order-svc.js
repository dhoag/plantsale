(function(){
    angular.module("order-svc", ['api-mod'])
        .service("OrderSvc", OrderSvc);
    OrderSvc.$inject = [ 'API', 'UrlGenerator'];

    function OrderSvc(){
        var svc = {
            getOrders: getOrders,
            updateOrderItem: updateOrderItem,
            addOrderItem: addOrderItem
        };
        return svc;
        function updateOrderItem(id, data){
            return API.$patch(UrlGenerator.user.updateOrderItem(id), data);
        }
        function addOrderItem( data){
            return API.$post(UrlGenerator.user.addOrderItem(), data);
        }
        function getOrders(){
            return API.$get(UrlGenerator.user.orders());
        }
    }
})();
