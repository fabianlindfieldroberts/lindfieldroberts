#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: URLs for the LindfieldRoberts about app              #
#####################################################################

from django.urls import path

from . import views

urlpatterns = [
    # Redirect to the home page
    path('', views.index, name='index'),
    path('kunchenghu/', views.kunchenghu, name='kunchenghu'),
    path('<str:gameName>/', views.dashboard, name='dashboard'),
    path('api/<str:gameName>/minutes_by_day/', views.minutes_by_day, name='minutes_by_day'),
    path('api/<str:gameName>/game_stats/', views.game_stats, name='game_stats'), 
    path('api/<str:gameName>/player_stats/', views.player_stats, name='player_stats'), 
    path('api/<str:gameName>/all_entries/', views.all_entries, name='all_entries')
]


