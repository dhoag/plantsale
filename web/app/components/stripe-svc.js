/**
 * Created by dhoag on 3/20/16.
 */
(function(){
    angular.module('stripe-svc', ['api-mod'])
        .service("StripeSvc", StripeSvc );
    StripeSvc.$inject = [ "API", "UrlGenerator", "$location"];
    function StripeSvc(API, UrlGenerator, $location){
        var svc = {
            promptForPayment: promptForPayment
        };
        return svc;

        function getChargeFunction(order){
           return function(token){
               var data = { token: token.id };
               API.$post(UrlGenerator.user.pay(order.id), data)
                   .then(function(response){
                       order.done = response.data.done;
                   })
                   .catch(function(ex){
                       console.log(ex);
                       toastr.error('There was a problem with the charge' );
                   });
           }
        }
        function promptForPayment(email, amt, order){
            var test_key = 'pk_test_gqdFo96Puw0yTTshH1rHadu0';
            var prod_key = 'pk_live_MMWng2ZqX5FKvST3cNVMI723';
            var key = prod_key;
            if(/local/.test($location.host())){
                key = test_key;
            }
            var handler = StripeCheckout.configure({
                key: key,
                image: "http://www.naperville203.org/cms/lib07/IL01904881/Centricity/Template/GlobalAssets/images/logos/mustang.jpg",
                locale: 'auto',
                token: getChargeFunction(order),
                email: email,
                allowRememberMe: false
            });
            handler.open({
                name: 'Mill St Plant Sale',
                description: 'Plant Order ($' + amt + ")",
                amount: amt * 100
            });

        }
    }

})();