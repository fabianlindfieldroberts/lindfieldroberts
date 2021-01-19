#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: Views for the LindfieldRoberts fabian app            #
#####################################################################

# Load HTML template
from django.template import loader

# Construct HTTP response from template
from django.http import HttpResponse

#################################################################
# FABIAN PAGE													#
#################################################################
def fabian(request):
	# Display the fabian page
	if request.method == 'GET':
		template = loader.get_template('fabian/fabian.html')
		context = {}
		return HttpResponse(template.render(context, request))