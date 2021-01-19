#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: URLs for the LindfieldRoberts geireann app           #
#####################################################################

from django.urls import path

from . import views

urlpatterns = [
	# Redirect to the geireann page
    path('', views.geireann, name='index'),
    path('geireann/', views.geireann, name='geireann')
]
