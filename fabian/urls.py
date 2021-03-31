#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: URLs for the LindfieldRoberts fabian app             #
#####################################################################

from django.urls import path

from . import views

urlpatterns = [
    path('fabian/', views.fabian, name='fabian')
]
