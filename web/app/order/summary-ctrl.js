(function(){
    angular.module('plantsale')
        .controller('Summary', Summary);
    Summary.$inject = ["Auth", "OrderManager", "OrderSvc", "Inventory", "StripeSvc"];

    function Summary(Auth, OrderManager, OrderSvc, Inventory, StripeSvc) {
        var vm = this;
        if(!Auth.isLoggedIn()){ return; }
        vm.removeItem = removeItem;
        vm.updateItemQty = updateItemQty;
        vm.payWithStripe = payWithStripe;

        vm.OrderManager = OrderManager;
        vm.user = null;
        vm.totalCost = 0;
        vm.user = Auth.getUser();
        vm.orderEmail;

        initialize();
        return;

        function payWithStripe(){
            StripeSvc.promptForPayment(vm.user.email, vm.totalCost, vm.OrderManager.selectedOrder);
        }
        function updateItemQty(item){
            console.log(item.newQty);
            OrderSvc.updateOrderItem(item.id, {"qty": item.newQty})
                .catch(function (ex) {
                    toastr.error("Please reload to ensure quantities are correct.");
                });
            updateTotal();
        }
        function updateTotal(){
            var items = vm.OrderManager.selectedOrder.items;
            var runningCosts = 0;
            for(i in items){
                console.log(items[i].plantObj);
                runningCosts += items[i].newQty * items[i].plantObj.cost;
            }
            vm.totalCost = runningCosts;
        }
        function removeItem(item){
            OrderSvc.deleteOrderItem(item.id)
                .catch(function (ex) {
                    toastr.error("Please reload to ensure order is correct.");
                });
            vm.totalCost -= item.newQty * item.plantObj.cost;
            item.qty = 0;
        }
        function addPlant(lineItem){
            Inventory.getPlant(lineItem.plant)
                .then(function(plant){
                    lineItem.plantObj = plant;
                    vm.totalCost += lineItem.qty * plant.cost;
                })
        }
        function enrichOrderItems(){
            var items = vm.OrderManager.selectedOrder.items;
            for(var i = items.length; i--;  ){
                var item = items[i];
                item.newQty = item.qty;
                addPlant(item);
            }
        }
        function initialize(){
            //The order to view was set outside of this controller
            if( OrderManager.selectedOrder){
                if( OrderManager.selectedOrder.email != vm.user.email ){
                    vm.orderEmail = OrderManager.selectedOrder.email;
                }
                enrichOrderItems();
                return;
            }
            OrderManager.getUserOrders( )
                .then(function () {
                   enrichOrderItems();
                });
        }

    }
})();