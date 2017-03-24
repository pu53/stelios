
from quiz.models import Choice, Quiz, Question, Answer 
from quiz.serializers import ChoiceSerializer, QuestionSerializer, QuizSerializer, AnswerSerializer
from quiz.serializers import QuizDataSerializer, QuestionDataSerializer, ChoiceDataSerializer
from profiles.serializers import UserSerializer
from wiki.serializers import SubtopicNameSerializer
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

class AnswerList(generics.ListCreateAPIView):
	queryset = Answer.objects.all()
	serializer_class = AnswerSerializer

class AnswerDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Answer.objects.all()
	serializer_class = AnswerSerializer

"""
An API endpoint giving all the information needed to present a quiz
"""
class QuizData(APIView):
	#post = nytt element, put = oppdater
	#authentication_classes = (authentication.TokenAuthentication)
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	
	def get(self, request, pk, format=json):
		
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
			
			subtopic = question.subtopic.all()
			subtopic_serializer = SubtopicNameSerializer(subtopic)
			subtopic_data = subtopic_serializer.data
			
			correct = question.correct_answer_to.all()
			correct_serializer = ChoiceDataSerializer(correct, many=True)
			correct_data = correct_serializer.data
			
			answers = {'choices': choice_data}
			answers.update(question_info)
			answers.update({'correct_answer':correct_data})
			#answers.update({'subtopic':subtopic_data})
			question_data.append(answers)
			
		content = {'questions':question_data}
		content.update(quiz_data)
		
		return Response(content)
		
	def post(self, request, format=json):
		
		return Response({})
		
class QuizFeedbackData(APIView):
	
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	
	def get(self, request, pk, format=json):
		
		user = User.objects.get(id=pk)
		user_serializer = UserSerializer(user)
		user_data = user_serializer.data
		
		name = user_data.name
		
		answers = Answer.objects.filter(userID=pk)
		
		
