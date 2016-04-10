(function(){
    angular.module('plantsale')
        .service('OrderManager', OrderManager);

    OrderManager.$inject = ["OrderSvc"];
    function OrderManager(OrderSvc){
        var that = this;
        this.getAllOrders = getAllOrders;
        this.setSelectedOrder = setSelectedOrder;
        this.getUserOrders = getUserOrders;

        this.selectedOrder;
        this.allOrders;

        return;

        function getUserOrders(){
            return OrderSvc.getOrders()
                .then(function(ex){
                    that.allOrders = ex.data;
                    setSelectedOrder(ex.data[0]);
                    return ex.data;
                });
        }
        function getOrder(id){
            return OrderSvc.getOrder(id)
                .then(function(ex){
                    setSelectedOrder(ex.data);
                    return ex.data;
                })
        }
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