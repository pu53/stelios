from django.db import models
import wiki

# models with fields related to quizes

class Quiz(models.Model):
	name = models.CharField(max_length=200)
	subject = models.ForeignKey("wiki.Subject", default=None)
	deadline = models.DateTimeField('Deadline')
	def __str__(self):
		return(self.name)

class Question(models.Model):
	text = models.CharField(max_length=500, default="")
	pub_date = models.DateTimeField('Date published')
	quiz = models.ForeignKey(Quiz)
	sub_topic = models.ForeignKey("wiki.Subtopic", default=None)
	#correct_choice = models.ForeignKey

	def __str__(self):
		return(self.text)

class Choice(models.Model):
	question = models.ForeignKey(Question, on_delete=models.CASCADE)
	choice_text = models.CharField(max_length=200)

	def __str__(self):
		return(self.choice_text)


