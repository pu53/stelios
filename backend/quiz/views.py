
from quiz.models import Choice, Quiz, Question, Answer
from profiles.models import Profile

from quiz.serializers import ChoiceSerializer, QuestionSerializer, QuizSerializer
from quiz.serializers import QuizDataSerializer, QuestionDataSerializer, ChoiceDataSerializer
from quiz.serializers import ChoiceIsTrueSerializer, AnswerSerializer, BlankAnswerSerializer
from quiz.serializers import AnswerSerializerNoHistory

from profiles.serializers import UserSerializer, UserIDNameSerializer, ProfileSerializer

from wiki.serializers import SubtopicNameIDSerializer, SubjectNameSerializer

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.parsers import JSONParser

import json
from django.utils.six import BytesIO

# creating a list and detail view for all models using generics

class QuestionList(generics.ListCreateAPIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	queryset = Question.objects.all()
	serializer_class = QuestionSerializer

class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	queryset = Question.objects.all()
	serializer_class = QuestionSerializer

class ChoiceList(generics.ListCreateAPIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	queryset = Choice.objects.all()
	serializer_class = ChoiceSerializer

class ChoiceDetail(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	queryset = Choice.objects.all()
	serializer_class = ChoiceSerializer

class QuizList(generics.ListCreateAPIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	queryset = Quiz.objects.all()
	serializer_class = QuizSerializer

class QuizDetail(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	queryset = Quiz.objects.all()
	serializer_class = QuizSerializer

"""
An API endpoint giving all the information needed to present a quiz
"""
class QuizData(APIView):
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
				#print("Relatert profil: " + repr(cur_user.user.id))
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
			result_data.pop('answer_history')
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
			#The blank and non blank answers have different serializers, and has
			#to be saved in seperate arrays
			if(answers[i]==-1):
				#print("Blankt svar!")
				answer_data = {
				'quizID':quizID,
				'questionID':questions[i]['id'],
				'answer_history': [userID]
				}
				blank_answer_data_rows.append(answer_data)

			else:
				answer_data = {
					'quizID':quizID,
					'questionID':questions[i]['id'],
					'choiceID':answers[i],
					'answer_history': [userID]
				}
				answer_data_rows.append(answer_data)

			print("Dette er dataen: " + str(answer_data))

		#The answers are serialized
		answer_serializer = AnswerSerializer(data=answer_data_rows, many=True)
		blank_answer_serializer = BlankAnswerSerializer(data=blank_answer_data_rows, many=True)

		#If the serialization was successfull, the answers get saved,
		#a relation between the user answering and the answers are made,
		#and 201 response is returned
		if(answer_serializer.is_valid() and blank_answer_serializer.is_valid()):
			answer_serializer.save()
			blank_answer_serializer.save()
			return Response(answer_serializer.data, status = status.HTTP_201_CREATED)
		#If not, noting gets saved, and an error message and a 400 status is returned
		print("This went wrong during serialization: " + str(answer_serializer.errors))
		return Response(answer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, format=json):
		answer_serializer = AnswerSerializer(data=request.data, many=True)

		if(answer_serializer.is_valid()):
			answer_serializer.save()

		return Response(answer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#A view supplying an authenticated user with result statistics
class QuizStatistics(APIView):
	permission_classes = ((permissions.IsAuthenticatedOrReadOnly,))
	
	def findSortKey(self, answer):
		number = answer['choiceID']
		if number == None:
			return -1
		else:
			return number
	
	def get(self, request, metric, scope, pk, format=json):
		"""
		The view starts by checking the scope, and retrives data accordingly
		The options are quiz, question and user
		"""
		answer_data={}
		scope_data={}
		max_number_of_questions=0
		if(scope == 'quiz'):
			answers = Answer.objects.filter(quizID=pk)
			answer_serializer = AnswerSerializerNoHistory(answers, many=True)
			answer_data = answer_serializer.data
			
			answers=[]
			
			quiz = Quiz.objects.get(id=pk)
			quiz_serializer = QuizSerializer(quiz)
			scope_data = quiz_serializer.data
			
			answer_data = sorted(answer_data, key=lambda answer:self.findSortKey(answer))
			answer_data = sorted(answer_data, key=lambda answer:answer['questionID'])
			
			new_answer_data=[]
			
			for answer in answer_data:
				new_answer_data.append(
					{
						'questionID': answer['questionID'],
						'choiceID': answer['choiceID']
					}
				)
			
			answer_data = new_answer_data
			
		data={
			'title': scope_data["title"],
			'id': scope_data["id"],
			'answers': answer_data
		}
		return Response(data)

class QuizCorrectAnswers(APIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

	def get(self, request, pk, format=json):
		quiz = Quiz.objects.get(id=pk)
		correct_answers = []

		questions = quiz.quiz_question.all()
		for question in questions:

			choices = question.question_choice.all()

			for choice in choices:

				if(choice.is_correct):
					correct_answers.append(choice.id)

		return Response({'correct': correct_answers})


class quizSubjectName(APIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

	def get(self, request, format=json):
		quizes = Quiz.objects.all()
		quiz_data_name = []

		for quiz in quizes:
			quiz_serializer = QuizDataSerializer(quiz)
			quiz_data = quiz_serializer.data

			subject = quiz.subject
			subjectnameserializer = SubjectNameSerializer(subject)
			subject_name_data = subjectnameserializer.data


			quiz_data.update(subject_name_data)

			quiz_data_name.append(quiz_data)

		return Response(quiz_data_name)
