(function(){
    angular.module('plantsale')
        .controller('Summary', Summary);
    Summary.$inject = ["Auth", "OrderSvc", "Inventory", "StripeSvc"];

    function Summary(Auth,OrderSvc, Inventory, StripeSvc) {
        var vm = this;
        vm.orders = [];
        vm.currentOrder = null;
        vm.user = null;
        vm.removeItem = removeItem;
        vm.updateItemQty = updateItemQty;
        vm.payWithStripe = payWithStripe;
        vm.totalCost = 0;

        if(!Auth.isLoggedIn()){
            return;
        }
        vm.user = Auth.getUser();
        initialize();
        function payWithStripe(){
            StripeSvc.promptForPayment(vm.user.email, vm.totalCost, vm.currentOrder);
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
            var items = vm.currentOrder.items;
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
        function initialize(){
            OrderSvc.getOrders()
                .then(function (ex) {
                    vm.orders = ex.data;
                    vm.currentOrder = ex.data[0];
                    for(i in vm.currentOrder.items ){
                        var item = vm.currentOrder.items[i];
                        item.newQty = item.qty;
                        addPlant(item);
                    }
                });
        }

    }
})();