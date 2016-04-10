(function(){
    angular.module("order-svc", ['api-mod'])
        .service("OrderSvc", OrderSvc);
    OrderSvc.$inject = [ 'API', 'UrlGenerator'];

    function OrderSvc(API, UrlGenerator){
        var svc = {
            getOrders: getOrders,
            getOrder: getOrder,
            getAllOrders: getAllOrders,
            updateOrderItem: updateOrderItem,
            deleteOrderItem: deleteOrderItem,
            addOrderItem: addOrderItem,
            updateOrder: updateOrder,
            getTotals: getTotals
        };
        return svc;
        function getTotals(){
            return API.$get(UrlGenerator.inventory.totals());
        }
        function updateOrder(id, data){
            return API.$patch(UrlGenerator.user.order(id), data);
        }
        function updateOrderItem(id, data){
            return API.$patch(UrlGenerator.user.updateItem(id), data);
        }
        function deleteOrderItem( id){
            return API.$delete(UrlGenerator.user.updateItem(id));
        }
        function addOrderItem( data){
            return API.$post(UrlGenerator.user.addItem(), data);
        }
        function getOrder(id){
            return API.$get(UrlGenerator.user.orders(id));
        }
        function getOrders(id){
            return API.$get(UrlGenerator.user.orders());
        }
        function getAllOrders(){
            return API.$get(UrlGenerator.user.allOrders());
        }
    }
})();
