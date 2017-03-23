from django.db import models
import wiki

# models with fields related to quizes

class Quiz(models.Model):
	title = models.CharField(max_length=200)
	subject = models.ForeignKey("wiki.Subject", default=None, blank=True)
	deadline = models.DateTimeField('Deadline', default=None, blank=True)
	def __str__(self):
		return(self.title)

class Question(models.Model):
	text = models.CharField(max_length=1000, default="")
	pub_date = models.DateTimeField('Date published')
	quiz = models.ManyToManyField(Quiz, related_name='quiz_question')
	subtopic = models.ForeignKey("wiki.Subtopic", default=None)

	def __str__(self):
		return(self.text)

class Choice(models.Model):
	question = models.ManyToManyField(Question, related_name='question_choice')
	choice_text = models.CharField(max_length=200)
	#Subtopic is included for potential later use
	subtopic = models.ForeignKey("wiki.Subtopic", default=None)
	correct_answer_to = models.ManyToManyField(Question, related_name='correct_answer_to', default=None, blank=True)
	def __str__(self):
		return(self.choice_text)

#class Answers(models,Model)
