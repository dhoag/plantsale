from django.conf.urls import include, url

from django.contrib import admin
from django.urls import path
from plants import api
admin.autodiscover()

urlpatterns = [
    #path(r'^admin/', include(admin.site.urls)),
    path(r'api/login/', api.Login.as_view(), name='login',),
    path(r'api/register/', api.Register.as_view(), name='register',),
    path(r'api/inventory/', api.Inventory.as_view(), name='inventory',),
    path(r'api/totals/', api.PlantSummary.as_view(), name='totals',),
    path(r'api/order/', api.GetOrder.as_view(), name='order',),
    path(r'api/order/(?P<pk>\d+)/', api.OrderDetail.as_view(), name='order_detail',),
    path(r'api/orders/', api.AllOrders.as_view(), name='order_all',),
    path(r'api/order/pay/(?P<order_id>\d+)/', api.PayOrder.as_view(), name='pay_order',),
    path(r'api/order/items/', api.Items.as_view(), name='list_items',),
    path(r'api/order/item/(?P<pk>\d+)/', api.UpdateOrderItem.as_view(), name='update_item',),
    path(r'api/account/(?P<pk>\d+)/', api.UpdateAccount.as_view(), name='update_account',),
]
