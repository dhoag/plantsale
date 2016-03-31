(function(ex){
    angular.module('plantsale')
        .controller('All',All);
    All.$inject = ["Auth", "OrderSvc" ];

    function All(Auth, OrderSvc ) {
        var vm = this;
        vm.saleTotal = 0;
        if(!Auth.isLoggedIn()){
             $location.path("/");
             return;
        }
        initialize();

        function initialize(){
            initListOfOrders();
        }
        function initListOfOrders(){
            OrderSvc.getAllOrders()
                .then(function(ex){
                    vm.allOrders = ex.data;
                    vm.saleTotal= 0;
                    for(idx in vm.allOrders){
                        vm.saleTotal += vm.allOrders[idx].total
                    }
                })
                .catch(function(ex){
                    console.log("User does not have access to all orders." + ex);
                });
        }

    }
})();