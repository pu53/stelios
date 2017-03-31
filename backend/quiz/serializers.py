from rest_framework import serializers
from quiz.models import Choice, Question, Quiz
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
# class ChoiceDataSerializer(serializers.Serializer):
# 	id = serializers.IntegerField(read_only=True)
# 	choice_text = serializers.CharField(max_length = 200)
# 	is_correct = serializers.BooleanField()
class QuestionDataSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Question
		fields = (['id','text','subtopic'])
# class QuestionDataSerializer(serializers.Serializer):
# 	id = serializers.IntegerField(read_only=True)
# 	text = serializers.CharField(max_length = 1000)

class QuizDataSerializer(serializers.Serializer):
	id = serializers.IntegerField(read_only=True)
	title = serializers.CharField(max_length=200)

class ChoiceIsTrueSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Choice
		fields = (['is_correct'])
