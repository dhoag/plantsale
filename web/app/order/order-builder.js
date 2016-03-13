(function () {
    angular.module('plantsale')
        .controller('OrderBuilder', OrderBuilder);
    OrderBuilder.$inject = ["Auth", "Inventory", "OrderSvc", "$location"];

    function OrderBuilder(Auth, Inventory, OrderSvc, $location) {
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
        if(vm.loggedIn && !/order/.test($location.path())) {
            $location.path("/order");
        }
        else {
            initialize();
        }

        function updateColor(plant){
            if(!vm.loggedIn) return;
            OrderSvc.updateOrderItem(plant.orderId, { "color": plant.free_color})
                .catch(function(ex){
                    toastr.error("Please reload to ensure quantity update updated.");
                });
        }
        function updateQty(plant){
            if(!vm.loggedIn) return;
            OrderSvc.updateOrderItem(plant.orderId, { "qty": plant.qty })
                .catch(function(ex){
                    toastr.error("Please reload to ensure quantity update updated.");
                });
        }
        function getRunningTotal(){
            if(!vm.loggedIn) return "Log in to create an order.";
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
        function getPlant(id){
            var plants = vm.plants;
            for(idx in plants){
                if(plants[idx].id == id) return plants[idx];
            }
            return {};
        }
        function setOrder(){
            OrderSvc.getOrders()
                .then(function (ex) {
                    vm.order = ex.data[0];
                    for(idx in vm.order.items){
                        var item = vm.order.items[idx]
                        var plant = getPlant(item.plant);
                        plant.selected = true;
                        if(plant.color_preference && plant.limit){
                            for(colIdx in plant.colors){
                                var color = plant.colors[colIdx]
                                if(item.color == color.free_color){
                                    color.orderId = item.id;
                                    color.qty = item.qty;
                                }
                            }
                        }
                        else{
                            plant.orderId = item.id;
                            plant.qty = item.qty;
                            plant.free_color = item.color;
                        }
                    }
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
            if(!vm.loggedIn) return;
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
