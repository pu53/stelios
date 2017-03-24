from django.contrib.auth.models import User
from quiz.models import Choice, Quiz, Question 
from quiz.serializers import ChoiceSerializer, QuestionSerializer, QuizSerializer
from quiz.serializers import QuizDataSerializer, QuestionDataSerializer, ChoiceDataSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions

import json

# creating a list and detail view for all models using generics

class QuestionList(generics.ListCreateAPIView):
	queryset = Question.objects.all()
	serializer_class = QuestionSerializer

class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Question.objects.all()
	serializer_class = QuestionSerializer

class ChoiceList(generics.ListCreateAPIView):
	queryset = Choice.objects.all()
	serializer_class = ChoiceSerializer

class ChoiceDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Choice.objects.all()
	serializer_class = ChoiceSerializer

class QuizList(generics.ListCreateAPIView):
	queryset = Quiz.objects.all()
	serializer_class = QuizSerializer

class QuizDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Quiz.objects.all()
	serializer_class = QuizSerializer

"""
An API endpoint giving all the information needed to present a quiz
"""
class QuizData(APIView):
	#authentication_classes = (authentication.TokenAuthentication)
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	
	def get(self, request, pk, format=None):
		
		quiz = Quiz.objects.get(id=pk)
		quiz_serializer = QuizDataSerializer(quiz)
		quiz_data = quiz_serializer.data
		
		questions = quiz.quiz_question.all()
		question_data = []
		for question in questions:
			
			question_serializer = QuestionDataSerializer(question)
			question_info = question_serializer.data
			
			choices = question.question_choice.all()
			choice_serializer = ChoiceDataSerializer(choices, many=True)
			choice_data = choice_serializer.data
			
			answers = {'choices': choice_data}
			answers.update(question_info)
			question_data.append(answers)
			
		content = {'questions':question_data}
		content.update(quiz_data)
		
		return Response(content)
