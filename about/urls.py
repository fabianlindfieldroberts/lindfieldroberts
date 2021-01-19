#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: URLs for the LindfieldRoberts about app              #
#####################################################################

from django.urls import path

from . import views

urlpatterns = [
	# Redirect to the home page
    path('', views.index, name='index')
]


