(function(){
   angular.module('plantsale').controller('Inventory', Inventory);
   Inventory.$inject = ["Auth",  "API", "UrlGenerator"];

   function Inventory(Auth, API, UrlGenerator){
      var vm = this;
      vm.searchText = "";
      vm.plants = [];
      initialize();

      function initialize(){
         API.$get(UrlGenerator.inventory.plants())
             .then(function(results){
                vm.plants = results.data;
             })

      }
   }
})();
