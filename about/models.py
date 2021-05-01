from django.conf import settings
from django.db import models

# For setting the correct time zone
from django.utils import timezone
import pytz

# Homepage game models
class HighScore(models.Model):
	userName = models.CharField(max_length=10)
	score = models.IntegerField(default=0)
	dateCreated = models.DateTimeField(default=timezone.now)
	dateModified = models.DateTimeField(default=timezone.now)
	activeFlag = models.BooleanField(default=True)

	def __str__(self):
		return self.userName + ' '  + str(self.score)

#################################################################
# APPALACHIA GAME MODELS										#
#################################################################

# Represents a game
class Game(models.Model):
	name = models.CharField(max_length=50)
	rules = models.CharField(max_length=2000)
	startDate = models.DateTimeField(default=None)
	endDate = models.DateTimeField(default=None)
	dateCreated = models.DateTimeField(default=timezone.now)
	dateModified = models.DateTimeField(default=timezone.now)
	activeFlag = models.BooleanField(default=True)

	def __str__(self):
		return str(self.name)

# Stats related to a user and a day
class Day(models.Model):
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
	)
	game = models.ForeignKey(
		Game, 
		on_delete=models.CASCADE,
		default=None
	)
	date = models.DateField(default=None)
	durationNonCumulative = models.IntegerField(default=None, blank=True, null=True)
	durationCumulative = models.IntegerField(default=None, blank=True, null=True)
	goalNonCumulative = models.IntegerField(default=None, blank=True, null=True)
	goalCumulative = models.IntegerField(default=None, blank=True, null=True)
	dateCreated = models.DateTimeField(default=timezone.now)
	dateModified = models.DateTimeField(default=timezone.now)
	activeFlag = models.BooleanField(default=True)

	def __str__(self):
		return str(self.user) + ' ' + str(self.date)


class Stat(models.Model):
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
	)
	game = models.ForeignKey(
		Game, 
		on_delete=models.CASCADE,
		default=None
	)
	day = models.ForeignKey(
		Day, 
		on_delete=models.CASCADE,
		default=None
	)
	comment = models.CharField(max_length=100, default=None, blank=True, null=True)
	duration = models.IntegerField(default=0)
	dateCreated = models.DateTimeField(default=timezone.now)
	dateModified = models.DateTimeField(default=timezone.now)
	activeFlag = models.BooleanField(default=True)

	def __str__(self):
		return str(self.user) + ' '  + str(self.day) + ' '  + str(self.duration)

