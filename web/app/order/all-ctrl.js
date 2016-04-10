(function(ex){
    angular.module('plantsale')
        .controller('All',All);
    All.$inject = ["Auth", 'OrderManager'];

    function All(Auth, OrderManager ) {
        var vm = this;
        vm.saleTotal = 0;
        vm.paidTotal = 0;
        vm.OrderManager = OrderManager;
        if(!Auth.isLoggedIn()){
             $location.path("/");
             return;
        }
        initialize();
        return;

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