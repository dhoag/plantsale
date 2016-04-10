(function(ex){
    angular.module('plantsale')
        .controller('All',All);
    All.$inject = ["Auth", 'OrderManager', 'OrderSvc', '$location'];

    function All(Auth, OrderManager, OrderSvc, $location ) {
        var vm = this;
        vm.viewOrder = viewOrder;
        vm.acceptCheck = acceptCheck;

        vm.saleTotal = 0;
        vm.paidTotal = 0;
        vm.OrderManager = OrderManager;
        if(!Auth.isLoggedIn()){
             $location.path("/");
             return;
        }
        initialize();
        return;

        function acceptCheck(order){
            if(order.checkNumber){
                order.showCheckNumber = false;
                var data = {
                    'done': true,
                    'charge_data': order.checkNumber.trim()
                };
                OrderSvc.updateOrder(order.id, data)
                    .then(function(ex){
                        order.done = true;
                        order.check = true;
                    })
                    .catch(function(ex){
                        toastr.error("Failed to update check number");
                        order.showCheckNumber = false;
                    })
            }
        }

        function viewOrder(order){
            vm.OrderManager.setSelectedOrder(order);
            $location.path('/summary');
        }
        function initialize(){
            initListOfOrders();
        }
        function initListOfOrders(){
            OrderManager.getAllOrders()
                .then(function(orders){
                    vm.saleTotal= 0;
                    vm.paidTotal = 0;
                    for(var idx = orders.length; idx--; ){
                        var order = orders[idx];
                        vm.saleTotal += order.total;
                        if(order.done){
                            if(order.charge_data != 'succeeded'){
                                order.checkNumber = order.charge_data;
                                order.check = true;
                            }
                            else{
                                order.online = true;
                            }
                            vm.paidTotal += orders[idx].total;
                        }
                    }
                })
                .catch(function(ex){
                    console.log("User does not have access to all orders." + ex);
                });
        }

    }
})();