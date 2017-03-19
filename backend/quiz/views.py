from django.contrib.auth.models import User
from quiz.models import Choice, Quiz, Question 
from quiz.serializers import ChoiceSerializer, QuestionSerializer, QuizSerializer
from rest_framework import generics, response
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
	

