from django.test import TestCase
from django.test import Client

# Constants
from .constants import LEADER_BOARD_LENGTH

# High score model and form
from .models import HighScore
from .forms import HighScoreForm

# Tests related to the High Score form
class HighScoreFormTests(TestCase):

	"""
	Can add a username and score within bounds
	"""
	def testNormalUserNameAndScore(self):
		print("\n======================================================")
		print("Running test with a normal user.")
		print("------------------------------------------------------")

		userName = 'testuser'
		score = 0
		formData = {
			'userName': userName,
			'score': score
		}
		highScoreForm = HighScoreForm(formData)

		print("Test data - user name:   " + userName)
		print("Test data - score:       " + str(score))
		print("......................................................")
		print("Form is valid?           " + str(highScoreForm.is_valid()))
		self.assertTrue(highScoreForm.is_valid())





	"""
	Cannot add a username with > 10 char
	"""
	def testExceedUserNameMaxLength(self):
		print("\n======================================================")
		print("Running test with a user name exceeding max length.")
		print("------------------------------------------------------")

		userName = 'testuser11c'
		score = 0
		formData = {
			'userName': userName,
			'score': score
		}
		highScoreForm = HighScoreForm(formData)

		print("Test data - user name:   " + userName)
		print("Test data - score:       " + str(score))
		print("......................................................")
		print("Form is valid?           " + str(highScoreForm.is_valid()))
		self.assertFalse(highScoreForm.is_valid())


	"""
	Cannot add a username with space
	"""
	def testSpaceInUserName(self):
		print("\n======================================================")
		print("Running test with a user name containing space.")
		print("------------------------------------------------------")
		
		userName = 'test user'
		score = 0
		formData = {
			'userName': userName,
			'score': score
		}
		highScoreForm = HighScoreForm(formData)

		print("Test data - user name:   " + userName)
		print("Test data - score:       " + str(score))
		print("......................................................")
		print("Form is valid?           " + str(highScoreForm.is_valid()))
		self.assertFalse(highScoreForm.is_valid())

	"""
	Cannot add a negative score
	"""
	def testExceedMinScore(self):
		print("\n======================================================")
		print("Running test with a score less than min score.")
		print("------------------------------------------------------")

		userName = 'testuser'
		score = -1
		formData = {
			'userName': userName,
			'score': score
		}
		highScoreForm = HighScoreForm(formData)

		print("Test data - user name:   " + userName)
		print("Test data - score:       " + str(score))
		print("......................................................")
		print("Form is valid?           " + str(highScoreForm.is_valid()))
		self.assertFalse(highScoreForm.is_valid())

	"""
	Cannot add a score > 126
	"""
	def testExceedMaxScore(self):
		print("\n======================================================")
		print("Running test with a score greater than max score.")
		print("------------------------------------------------------")

		userName = 'testuser'
		score = 127
		formData = {
			'userName': userName,
			'score': score
		}
		highScoreForm = HighScoreForm(formData)

		print("Test data - user name:   " + userName)
		print("Test data - score:       " + str(score))
		print("......................................................")
		print("Form is valid?           " + str(highScoreForm.is_valid()))
		self.assertFalse(highScoreForm.is_valid())

	"""
	Cannot add a score that isn't in top 15 results
	"""
	def testScoreNotInTopFifteen(self):
		print("\n======================================================")
		print("Running test with score not in top fifteen scores.")
		print("------------------------------------------------------")
		# Populate db with more than 15 scores
		for i in list(range(0,100)):
			highScore = HighScore(
				userName = 'testuser',
				score = i
			)
			highScore.save()

		lowestTopScore = HighScore.objects.order_by('-score', 'dateCreated')[LEADER_BOARD_LENGTH-1:LEADER_BOARD_LENGTH].values('score')
		
		# If there is a 15th score try to insert teh same score
		if (len(lowestTopScore) == 1):

			userName = 'testuser'
			score = lowestTopScore[0]['score']
			formData = {
				'userName': userName,
				'score': score
			}
			highScoreForm = HighScoreForm(formData)

			print("Test data - user name:   " + userName)
			print("Test data - score:       " + str(score))
			print("......................................................")
			print("Form is valid?           " + str(highScoreForm.is_valid()))
			self.assertFalse(highScoreForm.is_valid())

	"""
	Cannot add score/user name combo twice within 5 seconds
	"""
	def testRepeatedUserNameScoreCombo(self):
		print("\n======================================================")
		print("Running test inserting same user name/score combo.")
		print("------------------------------------------------------")
		
		# Populate an existing user name/score combo
		userName = 'testuser'
		score = 15
		highScore = HighScore(
			userName = userName,
			score = score
		)
		highScore.save()

		# Immediately after try to submit form with same username
		formData = {
			'userName': userName,
			'score': score
		}
		highScoreForm = HighScoreForm(formData)

		print("Test data - user name:   " + userName)
		print("Test data - score:       " + str(score))
		print("......................................................")
		print("Form is valid?           " + str(highScoreForm.is_valid()))
		self.assertFalse(highScoreForm.is_valid())


# Tests related to the Index view
class IndexViewTests(TestCase):
	"""
	Check the index page loads
	"""
	def testIndexLoads(self):
		print("\n======================================================")
		print("Running test to ensure index page loads as expected.")
		print("------------------------------------------------------")
		# create an instance of the client for our use
		client = Client()
		# get a response from '/'
		response = client.get('/')
		self.assertEqual(response.status_code, 200)

	"""
	TODO: add tests here
	"""




