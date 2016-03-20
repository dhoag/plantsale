(function(){
    angular.module('plantsale')
        .controller('Summary', Summary);
    Summary.$inject = ["Auth", "OrderSvc", "Inventory"];

    function Summary(Auth,OrderSvc, Inventory) {
        var vm = this;
        vm.orders = [];
        vm.user;
        vm.removeItem = removeItem;
        vm.updateItemQty = updateItemQty;
        vm.totalCost = 0;

        if(!Auth.isLoggedIn()){
            return;
        }
        vm.user = Auth.getUser();
        initialize();
        function updateItemQty(item){
            console.log(item.newQty);
            OrderSvc.updateOrderItem(item.id, {"qty": item.newQty})
                .catch(function (ex) {
                    toastr.error("Please reload to ensure quantities are correct.");
                });
            updateTotal();
        }
        function updateTotal(){
            var items = vm.orders[0].items;
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
                    var firstOrder = ex.data[0];
                    for(i in firstOrder.items ){
                        var item = firstOrder.items[i];
                        item.newQty = item.qty;
                        addPlant(item);
                    }
                });
        }

    }
})();