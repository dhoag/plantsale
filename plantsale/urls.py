from django.conf.urls import include, url

from django.contrib import admin
from plants import api
admin.autodiscover()

urlpatterns = [
    # Examples:
    # url(r'^$', 'plantsale.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/login/?$', api.Login.as_view(), name='login',),
    url(r'^api/register/?$', api.Register.as_view(), name='register',),
]
