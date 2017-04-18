
from quiz.models import Choice, Quiz, Question, Answer
from profiles.models import Profile

from quiz.serializers import ChoiceSerializer, QuestionSerializer, QuizSerializer
from quiz.serializers import QuizDataSerializer, QuestionDataSerializer, ChoiceDataSerializer
from quiz.serializers import ChoiceIsTrueSerializer, AnswerSerializer, BlankAnswerSerializer

from profiles.serializers import UserSerializer, UserIDNameSerializer, ProfileSerializer

from wiki.serializers import SubtopicNameIDSerializer

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.parsers import JSONParser

import json
from django.utils.six import BytesIO

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
			subtopic_serializer = SubtopicNameIDSerializer(subtopic, many=True)
			subtopic_data = subtopic_serializer.data
			
			answers = {'choices': choice_data}
			answers.update(question_info)
			answers.update({'subtopic':subtopic_data})
			question_data.append(answers)
			
		content = {'questions':question_data}
		content.update(quiz_data)
		
		return Response(content)

class SingleQuizResults(APIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	
	def get(self, request, pk, format=json):
		results = Answer.objects.filter(quizID=pk)

		return_data = []
		for result in results: 
			list_element = {}
			user_id = -1
			username = ""
			
			#Finds the related user to the current answer
			result_query = result.answer_history.all()

			#If there is a corresponding user, find name and id
			if(len(result_query) > 0):
				cur_user = result_query[0]
				print("Relatert profil: " + repr(cur_user.user.id))
				user_id = cur_user.user.id
				username = cur_user.user.username

			#Add the fields to the current list element
			list_element.update({
				'user_id':user_id,
				'username':username
			})

			#Serialize the answer, and add it to the current list element
			result_serializer = AnswerSerializer(result)
			result_data = result_serializer.data
			list_element.update(result_data)
			
			#Find out whether the answer is true or false, adds it to list element
			try:
				related_choice = Choice.objects.get(id=result_data['choiceID'])
				related_choice_serializer = ChoiceSerializer(related_choice)
				list_element.update({
					'correct':related_choice_serializer.data['is_correct']
				})
			except(Exception):
				#print("Finner ikke elementet med pk=null, setter false")
				list_element.update({
					'correct':False
				})
			
			#Add the list element to the return data
			return_data.append(list_element)
			
		return Response(return_data)
		
		
#A view for saving the answer data from a quiz
class SaveQuizResult(APIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	
	def post(self, request, format=json):
		answer_data_rows = []
		blank_answer_data_rows = []
		questions= request.data["questions"]
		answers  = request.data["choices"]
		quizID   = request.data["quizID"]
		userID   = request.data["userID"]
		
		#Iterates over every question 
		for i in range(len(questions)):
			print("Dette er spørsmål nr " + str(i) + " og det har data " + str(questions[i]))
			
			#The blank and non blank answers have different serializers, and has
			#to be saved in seperate arrays
			if(answers[i]==-1):
				print("Blankt svar!")
				answer_data = {
				'quizID':quizID,
				'questionID':questions[i]['id'],
				}
				blank_answer_data_rows.append(answer_data)
			
			else:
				answer_data = {
					'quizID':quizID,
					'questionID':questions[i]['id'],
					'choiceID':(answers[i])
				}
				answer_data_rows.append(answer_data)
			
			print("Dette er dataen: " + str(answer_data))
			#profile_updater = 
		
		#The answers are serialized with the correct serializer
		answer_serializer = AnswerSerializer(data=answer_data_rows, many=True)
		blank_answer_serializer = BlankAnswerSerializer(data=blank_answer_data_rows, many=True)
		
		#If the serialization was successfull, the answers get saved
		if(answer_serializer.is_valid() and blank_answer_serializer.is_valid()):
			answer_serializer.save()
			blank_answer_serializer.save()
			return Response(answer_serializer.data, status = status.HTTP_201_CREATED)
		print("Dette gikk galt: " + str(answer_serializer.errors))
		return Response(answer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, format=json):
		answer_serializer = AnswerSerializer(data=request.data, many=True)
		
		if(answer_serializer.is_valid()):
			answer_serializer.save()
		
		return Response(answer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChoiceIsTrue(APIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

	def get(self, request, pk, format=json):
		choice = Choice.objects.get(id=pk)
		isTrue = ChoiceIsTrueSerializer(choice)

		return Response(isTrue.data)
