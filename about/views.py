#####################################################################
# Author:      Fabian Lindfield Roberts                             #
# Description: Views for the LindfieldRoberts about app             #
#####################################################################


# Load HTML template
from django.template import loader

# Construct HTTP response from template
from django.http import HttpResponse, HttpResponseRedirect

# User authentication
from django.contrib.auth import authenticate

# Constants
from .constants import LEADER_BOARD_LENGTH

# High score model and form
from about.models import HighScore
from about.forms import HighScoreForm
# Appalachia model and form
from about.models import Game, Day, Stat 
from about.forms import StatForm
# Users
from django.contrib.auth.models import User

# Date and time zone
import datetime
from django.utils import timezone

# Formatting django queryset to JSON response
from django.http import JsonResponse
from django.db.models import F, Value, CharField, Max, Sum, Avg
from django.db.models.functions import Cast, ExtractHour, ExtractMinute, ExtractSecond, Concat, Round


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


#################################################################
# CHANGSHU VIEWS												#
#################################################################
def kunchenghu(request):
	# Display the changshu sprint
	if request.method == 'GET':
		template = loader.get_template('about/kunchenghu.html')
		context = {
		}
		return HttpResponse(template.render(context, request))


#################################################################
# APPALACHIA VIEWS    											#
#################################################################
def dashboard(request, gameName):
	# Display the appalachia page
	gameQuerySet = Game.objects.filter(name=gameName)
	if not gameQuerySet.exists():
		html = '<html><body>The game "' + gameName + '" does not exist. Please check your url.</body></html>'
		return HttpResponse(html)
	else:
		template = loader.get_template('about/dashboard.html')
		game = gameQuerySet[0]

		if request.method == 'GET':
			form = StatForm()

		elif request.method == 'POST':
			form = StatForm(request.POST)

			if form.is_valid():
				# Form is valid so user exists, get user
				user = authenticate(
					username=form.cleaned_data['userName'],
					password=form.cleaned_data['password']
				)
				# Get all days less than or equal to today's date with a null cumulative value
				recentDaysQuerySet = Day.objects.filter(
					user=user,
					game=game,
					date__lte=datetime.date.today(),
					durationCumulative__isnull=True,
					durationNonCumulative__isnull=True
				).order_by('date')

				# If there aren't recent null days then just add to current day
				if not recentDaysQuerySet.exists():
					todayQuerySet = Day.objects.filter(
						user=user, 
						game=game, 
						date=datetime.date.today(),
						durationCumulative__isnull=False,
						durationNonCumulative__isnull=False
					)
					if todayQuerySet.exists():
						day = todayQuerySet[0]
						# Update day, add to cumulative and non-cumulative durations
						day.durationCumulative += form.cleaned_data['duration']
						day.durationNonCumulative += form.cleaned_data['duration']
						day.save()
				# Otherwise then update all recent null days
				else:
					durationNonCumulative = 0 # There were no meters recorded on null days
					lastValidDate = recentDaysQuerySet[0].date - datetime.timedelta(1)
					lastValidDayQuerySet = Day.objects.filter(
						user=user, 
						game=game, 
						date=lastValidDate
					)
					if lastValidDayQuerySet.exists():
						durationCumulative = lastValidDayQuerySet[0].durationCumulative
					else:
						durationCumulative = 0

					# Go through recent days and update durations
					for i, day in enumerate(recentDaysQuerySet, start=1):
						# If the last element in loop
						if i == len(recentDaysQuerySet):
							day.durationNonCumulative = form.cleaned_data['duration']
							day.durationCumulative = durationCumulative + form.cleaned_data['duration']
						# Else just any element in loop
						else:
							day.durationNonCumulative = durationNonCumulative
							day.durationCumulative = durationCumulative

						day.save()


					
				# Create a stat database entry
				stat = Stat(
					user=user,
					game=game,
					day=day,
					comment=form.cleaned_data['comment'],
					duration=form.cleaned_data['duration']
				)
				stat.save()

				html = '<html><body>Thanks, ' + user.username \
					+ '. Your form was submitted successfully. <a href="https://www.lindfieldroberts.com/' \
					+ gameName + '/">Take me back to homepage.</a></body></html>'
				return HttpResponse(html)

		
		context = {
			'action': '/' + game.name + '/',
			'attestation': "Not a luder, just a lumpi",
			'rules': game.rules,
			'form': form
		}
		return HttpResponse(template.render(context, request))


# API views
def minutes_by_day(request, gameName):
	gameQuerySet = Game.objects.filter(name=gameName)
	if not gameQuerySet.exists():
		data = {}
	else:
		game = gameQuerySet[0]
		users = User.objects.filter(game=game)
		data = {}
		for user in users:
			day = Day.objects.filter(game=game, user=user, durationNonCumulative__isnull=False) \
				.annotate(Date=F('date')) \
				.annotate(DurationNonCumulative=F('durationNonCumulative')) \
				.annotate(DurationCumulative=F('durationCumulative')) \
				.values('Date', 'DurationNonCumulative', 'DurationCumulative')
			data[user.username] = list(day)
	return JsonResponse(data, safe=False)

def game_stats(request, gameName):
	gameQuerySet = Game.objects.filter(name=gameName)
	if not gameQuerySet.exists():
		data = {}
	else:
		game = gameQuerySet[0]	
		today = datetime.datetime.now(timezone.utc)
		elapsedDelta = today - game.startDate
		remainingDelta = game.endDate - today
		daysElapsed = elapsedDelta.days
		daysRemaining = remainingDelta.days
		data = [{
			'Elapsed': daysElapsed,
			'Remaining': daysRemaining
		}]
	return JsonResponse(data, safe=False)

def player_stats(request, gameName):
	gameQuerySet = Game.objects.filter(name=gameName)
	if not gameQuerySet.exists():
		data = {}
	else:
		game = gameQuerySet[0]
		today = datetime.datetime.now(timezone.utc)
		datesDelta = today - game.startDate
		daysElapsed = datesDelta.days
		data = []
		teamName = game.name[:1].upper() + game.name[1:]
		minutesSoFar = {
			'Stat': 'Minutes So Far',
			teamName: 0
		}
		minutesToMin = {
			'Stat': 'Minutes To Minimum',
			teamName: 0
		}
		minutesToGoal = {
			'Stat': 'Minutes To Goal',
			teamName: 0
		}
		perDayAverage = {
			'Stat': 'Per Day Average',
			teamName: 0
		}
		users = User.objects.filter(game=game)
		for user in users:
			username = user.username[:1].upper() + user.username[1:]
			
			day = Day.objects.filter(game=game, user=user, durationCumulative__isnull=False, durationNonCumulative__isnull=False)
			minutesSoFar[username] = day.aggregate(Max('durationCumulative'))['durationCumulative__max']
			minutesSoFar[teamName] += minutesSoFar[username]
			minutesToMin[username] = game.individualMinimum - minutesSoFar[username]
			minutesToMin[teamName] += minutesToMin[username]
			minutesToGoal[username] = game.individualGoal - minutesSoFar[username]
			minutesToGoal[teamName] += minutesToGoal[username]
			unroundedPerDayAverage = minutesSoFar[username]/daysElapsed
			perDayAverage[username] = round(unroundedPerDayAverage, 2)
			perDayAverage[teamName] += perDayAverage[username]

		perDayAverage[teamName] = round(perDayAverage[teamName]/len(users), 2)
		data.append(minutesSoFar)
		data.append(minutesToMin)
		data.append(minutesToGoal)
		data.append(perDayAverage)
	return JsonResponse(data, safe=False)

def all_entries(request, gameName):
	gameQuerySet = Game.objects.filter(name=gameName)
	if not gameQuerySet.exists():
		data = {}
	else:
		game = gameQuerySet[0]
		data = Stat.objects.filter(game=game) \
			.annotate(Participant=F('user__username')) \
			.annotate(Date=F('day__date')) \
			.annotate(
				Hour=ExtractHour('dateCreated'),
				Minute=ExtractMinute('dateCreated'),
				Second=ExtractSecond('dateCreated'),
				SecondRounded = Round('Second'), # This works in PostgreSQL but not SQLite
				Time=Concat(
					'Hour', Value(':'), 'Minute', Value(':'), 'SecondRounded',
					output_field=CharField()
				)
			) \
			.annotate(Comment=F('comment')) \
			.annotate(Minutes=F('duration')) \
			.values('Participant', 'Date', 'Time', 'Comment', 'Minutes') \
			.order_by('-dateCreated', 'duration') 
	return JsonResponse(list(data), safe=False)





