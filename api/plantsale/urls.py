from django.conf.urls import include, url

from django.contrib import admin
from plants import api
admin.autodiscover()

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/login/?$', api.Login.as_view(), name='login',),
    url(r'^api/register/?$', api.Register.as_view(), name='register',),
    url(r'^api/inventory/?$', api.Inventory.as_view(), name='inventory',),
    url(r'^api/totals/?$', api.PlantSummary.as_view(), name='totals',),
    url(r'^api/order/?$', api.GetOrder.as_view(), name='order',),
    url(r'^api/order/(?P<pk>\d+)/?$', api.OrderDetail.as_view(), name='order_detail',),
    url(r'^api/orders/?$', api.AllOrders.as_view(), name='order_all',),
    url(r'^api/order/pay/(?P<order_id>\d+)/?$', api.PayOrder.as_view(), name='pay_order',),
    url(r'^api/order/items/?$', api.Items.as_view(), name='list_items',),
    url(r'^api/order/item/(?P<pk>\d+)/?$', api.UpdateOrderItem.as_view(), name='update_item',),
    url(r'^api/account/(?P<pk>\d+)/?$', api.UpdateAccount.as_view(), name='update_account',),
]
