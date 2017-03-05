from django.db import models
import wiki

# models with fields related to quizes

class Quiz(models.Model):
	name = models.CharField(max_length=100)
	subject = models.ForeignKey(wiki.models.Subject, on_delete=models.CASCADE, default=None)

	def __str__(self):
		return("Quiz: "+self.name)

class Question(models.Model):
	question_text = models.CharField(max_length=200)
	pub_date = models.DateTimeField('Date published')
	deadline = models.DateTimeField('Deadline')
	quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
	sub_topic = models.ForeignKey(wiki.models.Subtopic, on_delete=models.CASCADE, default=None)

	def __str__(self):
		return("Question"+self.question_text)

class Choice(models.Model):
	question = models.ForeignKey(Question, on_delete=models.CASCADE)
	choice_text = models.CharField(max_length=200)
	is_corret = models.BooleanField()

	def __str__(self):
		return(self.choice_text)


