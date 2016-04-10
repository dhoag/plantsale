(function(ex){
    angular.module('plantsale')
        .controller('All',All);
    All.$inject = ["Auth", 'OrderManager', '$location'];

    function All(Auth, OrderManager, $location ) {
        var vm = this;
        vm.viewOrder = viewOrder;

        vm.saleTotal = 0;
        vm.paidTotal = 0;
        vm.OrderManager = OrderManager;
        if(!Auth.isLoggedIn()){
             $location.path("/");
             return;
        }
        initialize();
        return;

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
                        vm.saleTotal += orders[idx].total;
                        if(orders[idx].done){
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