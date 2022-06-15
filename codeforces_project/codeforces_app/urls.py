from django import views
from . import views
from django.urls import path
urlpatterns = [
    path("",views.index, name='index'),
    path("get_stats",views.get_stats,name='get_stats'),
    path("show",views.show, name="show"),
]