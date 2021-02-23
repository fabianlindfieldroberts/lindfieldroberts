from django.test import TestCase
from django.test import Client

# Constants
from .constants import LEADER_BOARD_LENGTH

# High score model and form
from .models import HighScore
from .forms import HighScoreForm

# Print to console
from sys import stderr



# Tests related to the High Score form
class HighScoreFormTests(TestCase):

	"""
	Can add a username and score within bounds
	"""
	def testNormalUserNameAndScore(self):
		formData = {
			'userName': 'testuser',
			'score': 0
		}
		highScoreForm = HighScoreForm(formData)
		self.assertTrue(highScoreForm.is_valid())

	"""
	Cannot add a username with > 10 char
	"""
	def testExceedUserNameMaxLength(self):
		formData = {
			'userName': 'testuser11c',
			'score': 0
		}
		highScoreForm = HighScoreForm(formData)
		self.assertFalse(highScoreForm.is_valid())

	"""
	Cannot add a username with space
	"""
	def testSpaceInUserName(self):
		formData = {
			'userName': 'test user',
			'score': 0
		}
		highScoreForm = HighScoreForm(formData)
		self.assertFalse(highScoreForm.is_valid())

	"""
	Cannot add a negative score
	"""
	def testExceedMinScore(self):
		formData = {
			'userName': 'testuser',
			'score': -1
		}
		highScoreForm = HighScoreForm(formData)
		self.assertFalse(highScoreForm.is_valid())

	"""
	Cannot add a score > 126
	"""
	def testExceedMaxScore(self):
		formData = {
			'userName': 'testuser',
			'score': 127
		}
		highScoreForm = HighScoreForm(formData)
		self.assertFalse(highScoreForm.is_valid())

	"""
	Cannot add a score that isn't in top 15 results
	"""
	def testScoreNotInTopFifteen(self):
		lowestScore = HighScore.objects.order_by('-score', 'dateCreated')[LEADER_BOARD_LENGTH-1:LEADER_BOARD_LENGTH].values('score')
		if (len(lowestScore) == 1):
			formData = {
				'userName': 'testuser',
				'score': lowestScore
			}
			highScoreForm = HighScoreForm(formData)
			self.assertFalse(highScoreForm.is_valid())




# Tests related to the Index view
class IndexViewTests(TestCase):
	"""
	Check the index page loads
	"""
	def testIndexLoads(self):
		# create an instance of the client for our use
		client = Client()
		# get a response from '/'
		response = client.get('/')
		self.assertEqual(response.status_code, 200)

	"""
	TODO: add tests here
	"""




