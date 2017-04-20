from rest_framework import serializers
from quiz.models import Choice, Question, Quiz, Answer
from django.contrib.auth.models import User
from drf_queryfields import QueryFieldsMixin


class QuestionSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Question
		fields = ('__all__')

class ChoiceSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Choice
		fields = ('__all__')

class QuizSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Quiz
		fields = ('__all__')


class ChoiceDataSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Choice
		fields = (['id','choice_text'])

class QuestionDataSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Question
		fields = (['id','text','subtopic'])

class QuizDataSerializer(serializers.Serializer):
	id = serializers.IntegerField(read_only=True)
	title = serializers.CharField(max_length=200)

class ChoiceIsTrueSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Choice
		fields = ('id','is_correct')

class AnswerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Answer
		fields = ('questionID','choiceID','quizID', 'answer_history')


class BlankAnswerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Answer
		fields = ('questionID', 'quizID', 'answer_history')
