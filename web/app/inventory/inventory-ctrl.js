(function () {
    angular.module('plantsale').controller('Inventory', Inventory);
    Inventory.$inject = ["Auth", "API", "UrlGenerator"];

    function Inventory(Auth, API, UrlGenerator) {
        var vm = this;
        vm.searchText = "";
        vm.plants = [];
        vm.toggleCat = toggleCat;
        vm.getTotal = getTotal;
        vm.getRunningTotal = getRunningTotal;
        vm.orders = {};
        vm.categories = [];
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
            API.$get(UrlGenerator.inventory.plants())
                .then(function (results) {
                    vm.plants = results.data;
                    var types = {};
                    for(var idx in vm.plants){
                        vm.plants[idx].qty = 1;
                        var cat = vm.plants[idx].type;
                        types[cat] = { name: cat, mkt: vm.plants[idx].marketing};

                        if(vm.plants[idx].color_preference) {
                            if(vm.plants[idx].color_limits){
                                vm.plants[idx].limit = true;
                                var colors = vm.plants[idx].color_limits.split(";");
                                var values = [];
                                for( var colIdx in colors){
                                    values.push( { name: colors[colIdx], qty: 0});
                                }
                                vm.plants[idx].colors = values;
                            }
                            else {
                                vm.plants[idx].free_color = { name: "", qty: 0};
                            }
                        }
                    }
                    var result = [];
                    for(i in types){
                        result.push(types[i]);
                    }
                    vm.categories = result;
                    console.log(vm.categories);
                })

        }
    }
})();
