#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: URLs for the LindfieldRoberts fabian app             #
#####################################################################

from django.contrib import admin
from django.conf.urls import include, url

urlpatterns = [
    url(r'^', include('fabian.urls'))
]