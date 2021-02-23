
from django import forms

# Constants
from .constants import LEADER_BOARD_LENGTH

# High Score model
from .models import HighScore

class HighScoreForm(forms.Form):
	userName = forms.CharField(min_length=1, max_length=10, strip=True)
	score = forms.IntegerField(min_value=0, max_value=126)

	def clean(self):
		cleanedData = super().clean()
		userName = cleanedData.get('userName')
		score = cleanedData.get('score')

		if userName:
			# check if the username has a space
			for character in userName:
				if character.isspace():
					self.add_error('userName', 'User name must not contain whitespace.')
					break

		if score:
			# check if the score is in top 15 results
			lowestScore = HighScore.objects.order_by('-score', 'dateCreated')[LEADER_BOARD_LENGTH-1:LEADER_BOARD_LENGTH].values('score')
			if (len(lowestScore) == 1) and (score <= lowestScore[0]['score']):
				self.add_error('score', 'Score must be in top fifteen scores.')