#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: Views for the LindfieldRoberts about app             #
#####################################################################


# Load HTML template
from django.template import loader

# Construct HTTP response from template
from django.http import HttpResponse, HttpResponseRedirect

# Constants
from .constants import LEADER_BOARD_LENGTH

# High score model and form
from .models import HighScore
from .forms import HighScoreForm

# Debug
from sys import stderr

#################################################################
# LANDING PAGE													#
#################################################################
def index(request):
	# Display the lindfield roberts pacman game
	if request.method == 'GET':
		template = loader.get_template('about/index.html')
		# Sort first by score descending and then by date created descending
		highScores = HighScore.objects.order_by('-score', 'dateCreated')[:LEADER_BOARD_LENGTH]
		context = {
			'highScores': highScores
		}
		return HttpResponse(template.render(context, request))
	# Get a new high score
	elif request.method == 'POST':
		form = HighScoreForm(request.POST)

		if form.is_valid():
			# Add score to database

			highScore = HighScore(
				userName = form.cleaned_data['userName'],
				score = form.cleaned_data['score']
			)

			highScore.save()	
			# Remove the lowest (100th) score from the database
			lowestHighScore = HighScore.objects.order_by('-score', 'dateCreated')[99:100]
			if (len(lowestHighScore) == 1):
				lowestHighScore.delete()

		
		return HttpResponseRedirect('/')

# Helper function to remove all scores from the database
def deleteAllScores():
	allScores = HighScore.objects.all()
	for score in allScores:
		score.delete()

# Helper function to print all scores in database to the console
def printAllScores():
	allScores = HighScore.objects.order_by('-score', 'dateCreated')
	for score in allScores:
		print(score, stderr)
	
# Helper method for creating placeholder scores for the game
def createPlaceholderScores():
	deleteAllScores()
	for i in list(range(0,15)):
		highScore = HighScore(
			userName = "HBD!Daddy!",
			score = 60
		)
		highScore.save()
