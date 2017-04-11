from django.db import models
import wiki

# models with fields related to quizes

class Quiz(models.Model):
	title = models.CharField(max_length=200)
	subject = models.ForeignKey("wiki.Subject", default=None, blank=True)
	deadline = models.DateTimeField('Deadline', null=True, default=None, blank=True)
	def __str__(self):
		return(self.title)

class Question(models.Model):
    text = models.TextField(default="")
    subtopic = models.ManyToManyField("wiki.Subtopic", default=None, related_name="subtopic_question")
    quiz = models.ForeignKey(Quiz, related_name='quiz_question', default=None)
    def __str__(self):
        return(self.text)

class Choice(models.Model):
	question = models.ForeignKey(Question, related_name='question_choice', default=None)
	choice_text = models.CharField(max_length=200)
	is_correct = models.BooleanField(default=False)
	def __str__(self):
		return(self.choice_text)
		
class Answer(models.Model):
	questionID = models.ForeignKey(Question, related_name='Answer_Question', default=None)
	choiceID = models.ForeignKey(Choice, related_name='Answer_Choice', default=None, null=True)
	quizID = models.ForeignKey(Quiz, related_name='Answer_Quiz', default=None)
