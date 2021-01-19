#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: Views for the LindfieldRoberts geireann app          #
#####################################################################

# Load HTML template
from django.template import loader

# Construct HTTP response from template
from django.http import HttpResponse

#################################################################
# GEIREANN PAGE													#
#################################################################
def geireann(request):
	# Display the geireann page
	if request.method == 'GET':
		template = loader.get_template('geireann/geireann.html')
		context = {}
		return HttpResponse(template.render(context, request))
