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

class AnswerSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Answer
		fields = ('__all__')

class ChoiceDataSerializer(serializers.Serializer):
	id = serializers.IntegerField(read_only=True)
	choice_text = serializers.CharField(max_length = 200)

class QuestionDataSerializer(serializers.Serializer):
	id = serializers.IntegerField(read_only=True)
	text = serializers.CharField(max_length = 1000)

class QuizDataSerializer(serializers.Serializer):
	id = serializers.IntegerField(read_only=True)
	title = serializers.CharField(max_length=200)

class AnswerSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Answer
		fields = ('__all__')

