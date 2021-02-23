from django.db import models

# For setting the correct time zone
from django.utils import timezone
import pytz

# Maintain a list of top 100s high scores
class HighScore(models.Model):
	userName = models.CharField(max_length=10)
	score = models.IntegerField(default=0)
	dateCreated = models.DateTimeField(default=timezone.now)
	dateModified = models.DateTimeField(default=timezone.now)
	activeFlag = models.BooleanField(default=True)

	def __str__(self):
		return self.userName + ' '  + str(self.score);