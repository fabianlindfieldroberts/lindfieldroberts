
from django import forms

# Constants
from .constants import LEADER_BOARD_LENGTH

# High Score model
from .models import HighScore, Stat

# User model
from django.contrib.auth.models import User

# Date & time
from django.utils import timezone
from datetime import timedelta

# User authentication
from django.contrib.auth import authenticate

#################################################################
# LINDFIELDROBERTS.COM FORMS									#
#################################################################
class HighScoreForm(forms.Form):
	userName = forms.CharField(min_length=1, max_length=10, strip=True)
	score = forms.IntegerField(min_value=0, max_value=126)

	def clean(self):
		cleanedData = super().clean()
		userName = cleanedData.get('userName')
		score = cleanedData.get('score')

		if userName is not None:
			# check if the username has a space
			for character in userName:
				if character.isspace():
					self.add_error('userName', 'User name must not contain whitespace')
					break

		if score is not None:
			# get the top 15 scores
			highScores = HighScore.objects.order_by('-score', 'dateCreated')[:LEADER_BOARD_LENGTH].values('score', 'userName', 'dateCreated')
			# check if the score is outside of top 15
			if (len(highScores) == 15) and (score <= highScores[LEADER_BOARD_LENGTH-1]['score']):
				self.add_error('score', 'Score must be in top fifteen scores')

			elif userName is not None:
				# check if user name and score combo was inserted in last 5 seconds
				match = HighScore.objects.filter(userName=userName, score=score, dateCreated__gte=(timezone.now() - timedelta(seconds=5)))
				if len(match) >= 1:
					self.add_error('userName', 'User submitted same user name score combo within 5 second time span')


#################################################################
# APPALACHIA FORMS						            			#
#################################################################
class StatForm(forms.Form):
	userName = forms.CharField(min_length=1, max_length=10, strip=True)
	password = forms.CharField(widget=forms.PasswordInput)
	comment = forms.CharField(max_length=50, required=False)
	duration = forms.IntegerField(min_value=5, max_value=600)

	def clean(self):
		cleanedData = super().clean()
		userName = cleanedData.get('userName')
		password = cleanedData.get('password')



		if userName is not None:
			# Check if userName exists
			match = User.objects.filter(username=userName)
			if len(match) < 1:
				self.add_error('userName', 'Username does not exist')

			elif password is not None:
				# Check if there is a username password match
				user = authenticate(
					username=userName,
					password=password
				)
				if user is None:
					self.add_error('password', 'Incorrect password')
				# check if user submitted time in last 5 seconds
				match = Stat.objects.filter(user=user, dateCreated__gte=(timezone.now() - timedelta(seconds=5)))
				if len(match) >= 1:
					self.add_error('userName', 'You cannot submit two scored within 5s')





