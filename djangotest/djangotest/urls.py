from django.conf.urls import include, url
from django.contrib import admin
from add import views as add_views
from add1 import views as add1_views


urlpatterns = [
    # Examples:
    # url(r'^$', 'djangotest.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
	url(r'^add/$',add_views.add,name='add'),
	url(r'^add/(\d+)/(\d+)/$',add_views.add1,name='add1'),
	url(r'^$',add_views.index,name='home'),
	url(r'^addN$',add1_views.index,name='add1index'),
]
