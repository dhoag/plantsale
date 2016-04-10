(function(){
    angular.module('plantsale')
        .service('OrderManager', OrderManager);

    OrderManager.$inject = ["OrderSvc"];
    function OrderManager(OrderSvc){
        var that = this;
        this.getAllOrders = getAllOrders;
        this.setSelectedOrder = setSelectedOrder;
        this.selectedOrder;
        this.allOrders;

        return;

        function getAllOrders(){
            return OrderSvc.getAllOrders()
                .then(function(result){
                    that.allOrders = result.data;
                    return result.data;
                })
        }
        function setSelectedOrder(order){
            that.selectedOrder = order;
            return that;
        }
    }
})();