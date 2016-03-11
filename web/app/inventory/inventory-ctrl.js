(function () {
    angular.module('plantsale').controller('Inventory', Inventory);
    Inventory.$inject = ["Auth", "API", "UrlGenerator"];

    function Inventory(Auth, API, UrlGenerator) {
        var vm = this;
        vm.searchText = "";
        vm.plants = [];
        vm.toggleOrder = toggleOrder;
        vm.toggleCat = toggleCat;
        vm.orders = {};
        vm.categories = [];
        initialize();
        function toggleCat(category){
            for(var idx in vm.plants){
                if(vm.plants[idx].type == category)
                    vm.plants[idx].category = !vm.plants[idx].category;
            }
        }
        function toggleOrder(clicked){
           console.log(clicked);
        }
        function initialize()
        {
            API.$get(UrlGenerator.inventory.plants())
                .then(function (results) {
                    vm.plants = results.data;
                    var types = new Set();
                    for(var idx in vm.plants){
                        vm.plants[idx].qty = 1;
                        types.add(vm.plants[idx].type);
                        if(vm.plants[idx].color_preference) {
                            if(vm.plants[idx].color_limits){
                                vm.plants[idx].limit = true;
                                vm.plants[idx].colors = vm.plants[idx].color_limits.split(";");
                            }
                            else {
                                vm.plants[idx].free_color = "";
                            }
                        }
                    }
                    vm.categories = Array.from(types);
                    console.log(vm.categories);
                })

        }
    }
})();
