/**
 * Created by dhoag on 3/20/16.
 */
(function(){
    angular.module('stripe-svc', ['api-mod'])
        .service("StripeSvc", StripeSvc );
    StripeSvc.$inject = [ "API", "UrlGenerator"];
    function StripeSvc(API, UrlGenerator){
        var svc = {
            promptForPayment: promptForPayment
        };
        return svc;

        function sendCharge(token){
            console.log(token);
            // You can access the token ID with `token.id`
        }
        function promptForPayment(email, amt){
            var handler = StripeCheckout.configure({
                key: 'pk_test_gqdFo96Puw0yTTshH1rHadu0',
                image: "http://www.naperville203.org/cms/lib07/IL01904881/Centricity/Template/GlobalAssets/images/logos/mustang.jpg",
                locale: 'auto',
                token: sendCharge,
                email: email
            });
            handler.open({
                name: 'Mill St Plant Sale',
                description: 'Plant Order ($' + amt + ")",
                amount: amt * 100
            });

        }
    }

})();