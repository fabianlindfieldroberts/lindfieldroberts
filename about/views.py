#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: Views for the LindfieldRoberts about app             #
#####################################################################


# Load HTML template
from django.template import loader

# Construct HTTP response from template
from django.http import HttpResponse


#################################################################
# LANDING PAGE													#
#################################################################
def index(request):
	# Display the lindfield roberts pacman game
	if request.method == 'GET':
		template = loader.get_template('about/index.html')
		context = {}
		return HttpResponse(template.render(context, request))

