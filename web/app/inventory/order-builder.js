(function () {
    angular.module('plantsale')
        .controller('OrderBuilder', OrderBuilder);
    OrderBuilder.$inject = ["Auth", "Inventory", "OrderSvc", "$scope"];

    function OrderBuilder(Auth, Inventory, OrderSvc, $scope) {
        var vm = this;
        vm.order = null;
        vm.searchText = "";
        vm.plants = [];
        vm.toggleCat = toggleCat;
        vm.getTotal = getTotal;
        vm.getRunningTotal = getRunningTotal;
        vm.toggleOrderItem = toggleOrderItem;
        vm.orders = {};
        vm.categories = [];
        vm.loggedIn = Auth.isLoggedIn();
        initialize();
        function getRunningTotal(){
            var total = 0;
            for(idx in vm.plants){
                if(vm.plants[idx].selected)
                    total += getTotal(vm.plants[idx]);
            }
            return total;
        }
        function getTotal(plant){
            if(plant.limit) {
                var total = 0;
                for(var idx in plant.colors){
                    total += (plant.colors[idx].qty *1);
                }
                return total * plant.cost;
            }
            return plant.qty * plant.cost;
        }
        function toggleCat(category){
            for(var idx in vm.plants){
                if(vm.plants[idx].type == category)
                    vm.plants[idx].category = !vm.plants[idx].category;
            }
        }
        function setOrder(){
            OrderSvc.getOrders()
                .then(function (ex) {
                    vm.order = ex.data[0];
                })
        }
        function initialize()
        {
            Inventory.getPlants()
                .then(function(ex){
                    vm.plants = ex;
                    vm.categories = Inventory.getCategories();
                    if(vm.loggedIn) {
                        setOrder();
                    }
                })
        }

        function addPlantToOrder(plant) {
            console.log("Adding " + plant.name);
            var data = {
                order: vm.order.id,
                qty: plant.qty,
                plant: plant.id
            };
            OrderSvc.addOrderItem(data)
                .then(function (ex) {
                    plant.orderId = ex.data.id;
                })
                .catch(function (error) {
                    toastr.error("Failed to add item to order", error);
                })
        }

        function removePlantFromOrder(plant) {
            console.log("Deleting" + plant.name);
            OrderSvc.deleteOrderItem(plant.orderId)
                .then(function (ex) {
                    plant.orderId = null;
                })
                .catch(function (error) {
                    toastr.error("Failed to remove item fro order", error);
                })
        }

        function toggleOrderItem(plant){
            if(!plant.color_preference){
                if(plant.selected){
                    addPlantToOrder(plant);
                }
                else{
                    removePlantFromOrder(plant);
                }
            }
        }
    }
})();
