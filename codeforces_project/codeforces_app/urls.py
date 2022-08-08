from django import views
from . import views
from django.urls import path
urlpatterns = [
    path("",views.index, name='index'),
    path("get_stats",views.get_stats,name='get_stats'),
    path("profile_info",views.profile_info, name="profile_info"),
    path("show",views.show, name="show"),
    path("compare",views.compare, name="compare"),
]