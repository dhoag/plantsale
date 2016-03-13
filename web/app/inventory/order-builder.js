(function () {
    angular.module('plantsale')
        .controller('OrderBuilder', OrderBuilder);
    OrderBuilder.$inject = ["Auth", "Inventory", "OrderSvc", "$scope"];

    function OrderBuilder(Auth, Inventory, OrderSvc, $scope) {
        var vm = this;
        vm.searchText = "";
        vm.plants = [];
        vm.toggleCat = toggleCat;
        vm.getTotal = getTotal;
        vm.getRunningTotal = getRunningTotal;
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
        function initialize()
        {
            Inventory.getPlants()
                .then(function(ex){
                    vm.plants = ex;
                    vm.categories = Inventory.getCategories();
                    $scope.$watch( vm.plants, changeHandler );
                })
        }
        function changeHandler(ex){
            console.log(ex);
        }
    }
})();
