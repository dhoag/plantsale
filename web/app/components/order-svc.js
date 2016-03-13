(function(){
    angular.module("order-svc", ['api-mod'])
        .service("OrderSvc", OrderSvc);
    OrderSvc.$inject = [ 'API', 'UrlGenerator'];

    function OrderSvc(API, UrlGenerator){
        var svc = {
            getOrders: getOrders,
            updateOrderItem: updateOrderItem,
            deleteOrderItem: deleteOrderItem,
            addOrderItem: addOrderItem
        };
        return svc;
        function updateOrderItem(id, data){
            return API.$patch(UrlGenerator.user.updateItem(id), data);
        }
        function deleteOrderItem( id){
            return API.$delete(UrlGenerator.user.updateItem(id));
        }
        function addOrderItem( data){
            return API.$post(UrlGenerator.user.addItem(), data);
        }
        function getOrders(){
            return API.$get(UrlGenerator.user.orders());
        }
    }
})();
