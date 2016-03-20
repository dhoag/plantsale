(function () {
    angular.module('inventory-svc',['api-mod'])
        .service('Inventory', Inventory);
    Inventory.$inject = ["API", "UrlGenerator", "$q"];

    function Inventory(API, UrlGenerator, $q) {
        var svc = {
            getPlants: getPlants,
            getPlant: getPlant,
            getCategories: getCategories
        };
        var categories = [];
        var plants = [];
        return svc;

        function getCategories(){
            return categories;
        }
        function lookupById(id){
            for(i in plants){
                if(plants[i].id == id) return plants[i];
            }
            return null;
        }
        function getPlant(id){
            return getPlants().then(
                function(){
                    return lookupById(id);
                }
            )
        }
        function getPlants()
        {
            if(plants.length > 0){
                return $q.when(plants);
            }
            return API.$get(UrlGenerator.inventory.plants())
                .then(function (results) {
                    plants = results.data;
                    var types = {};
                    for(var idx in plants){
                        plants[idx].qty = 1;
                        var cat = plants[idx].type;
                        types[cat] = { name: cat, mkt: plants[idx].marketing};

                        if(plants[idx].color_preference) {
                            if(plants[idx].color_limits){
                                plants[idx].limit = true;
                                var colors = plants[idx].color_limits.split(";");
                                var values = [];
                                for( var colIdx in colors){
                                    values.push( { free_color: colors[colIdx], qty: 0, id: plants[idx].id});
                                }
                                plants[idx].colors = values;
                            }
                            else {
                                plants[idx].free_color = "";
                            }
                        }
                    }
                    var result = [];
                    for(i in types){
                        result.push(types[i]);
                    }
                    categories = result;
                    return plants;
                })

        }
    }
})();
