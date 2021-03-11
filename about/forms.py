
from django import forms

# Constants
from .constants import LEADER_BOARD_LENGTH

# High Score model
from .models import HighScore

# Date & time
from django.utils import timezone
from datetime import timedelta


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
					self.add_error('userName', 'User name must not contain whitespace.')
					break

		if score is not None:
			# get the top 15 scores
			highScores = HighScore.objects.order_by('-score', 'dateCreated')[:LEADER_BOARD_LENGTH].values('score', 'userName', 'dateCreated')
			# check if the score is outside of top 15
			if (len(highScores) == 15) and (score <= highScores[LEADER_BOARD_LENGTH-1]['score']):
				self.add_error('score', 'Score must be in top fifteen scores.')

			elif userName is not None:
				# check if user name and score combo was inserted in last 5 minutes
				match = HighScore.objects.filter(userName=userName, score=score, dateCreated__gte=(timezone.now() - timedelta(seconds=5))).values('score', 'userName', 'dateCreated')
				if len(match) >= 1:
					self.add_error('userName', 'User submitted same user name score combo within 5 second time span.')





