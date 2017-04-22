from django.contrib.auth.models import User
from profiles.serializers import UserSerializer, UserCreateSerializer
from wiki.serializers import SubjectSerializer, SubjectInfoSerializer
from quiz.serializers import QuizSerializer
from quiz.models import Quiz
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserCreate(generics.CreateAPIView):
    model = get_user_model()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserCreateSerializer

class UserData(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get(self, request, pk, format = None):
        user = User.objects.get(id = pk)
        profile = user.profile

        #all related subjects to a user
        subjects = profile.subjects.all()

        user_serializer = UserSerializer(user)
        user_data = user_serializer.data

        subject_list = []   #list of subjects for a given user
        quiz_list = []      #list of quizes for a given user

        #add all relevant subjects to a list
        for sub in subjects:
            subject_serializer = SubjectInfoSerializer(sub)
            subject_list.append(subject_serializer.data)

            #all quizes related to the subject
            quizes = Quiz.objects.filter(subject = sub.id)

            #add all relevant quizes to a list
            for quiz in quizes:
                quiz_serializer = QuizSerializer(quiz)
                quiz_list.append(quiz_serializer.data)


        content = {'subjects': subject_list}
        user_data.update(content)

        content = {'quizes': quiz_list}
        user_data.update(content)

        return Response(user_data)
