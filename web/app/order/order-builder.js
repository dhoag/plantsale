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
        vm.updateQty = updateQty;
        vm.updateColor = updateColor;
        vm.orders = {};
        vm.categories = [];
        vm.loggedIn = Auth.isLoggedIn();
        initialize();

        function updateColor(plant){
            OrderSvc.updateOrderItem(plant.orderId, { "color": plant.free_color})
                .catch(function(ex){
                    toastr.error("Please reload to ensure quantity update updated.");
                });
        }
        function updateQty(plant){
            OrderSvc.updateOrderItem(plant.orderId, { "qty": plant.qty })
                .catch(function(ex){
                    toastr.error("Please reload to ensure quantity update updated.");
                });
        }
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

        function addItem(plant) {
            var data = {
                order: vm.order.id,
                qty: plant.qty,
                plant: plant.id
            };
            if(plant.free_color){
                data['color'] = plant.free_color;
            }
            OrderSvc.addOrderItem(data)
                .then(function (ex) {
                    plant.orderId = ex.data.id;
                })
                .catch(function (error) {
                    toastr.error("Failed to add item to order", error);
                })
        }

        function toggleOrderItem(plant){
            var add = plant.selected;

            if(!plant.color_preference || !plant.limit) {
                if(add)
                    addItem(plant);
                else
                    removeItem(plant);
            }
            else{
                for(idx in plant.colors){
                    if(add)
                        addItem(plant.colors[idx]);
                    else
                        removeItem(plant.colors[idx]);
                }
            }
        }

        function removeItem(plant) {
            OrderSvc.deleteOrderItem(plant.orderId)
                .then(function (ex) {
                    plant.orderId = null;
                })
                .catch(function (error) {
                    toastr.error("Failed to remove item fro order", error);
                })
        }

    }
})();
