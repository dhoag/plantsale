(function () {
    angular.module('plantsale')
        .service('Inventory', Inventory);
    Inventory.$inject = ["Auth", "API", "UrlGenerator"];

    function Inventory(Auth, API, UrlGenerator) {
        var svc = {
            getPlants: getPlants,
            getCategories: getCategories
        };
        var categories = [];
        var plants = [];
        return svc;

        function getCategories(){
            return categories;
        }
        function getPlants()
        {
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
                                    values.push( { name: colors[colIdx], qty: 0});
                                }
                                plants[idx].colors = values;
                            }
                            else {
                                plants[idx].free_color = { name: "", qty: 0};
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
