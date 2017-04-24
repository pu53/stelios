from django.contrib.auth.models import User
from profiles.serializers import UserSerializer, UserCreateSerializer
from profiles.models import Profile
from wiki.serializers import SubjectSerializer, SubjectInfoSerializer
from wiki.models import Subject
from quiz.serializers import QuizSerializer
from quiz.models import Quiz
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
import json

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


class addSubject(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def put(self, request, format=json):
        print("yolo test")
        print(request.data)
        subject = Subject.objects.get(id=request.data["subject"])
        user = User.objects.get(id=request.data["user"])

        profile = user.profile

        profile.subjects.add(subject)

        return Response({})

    def delete(self, request, format=json):
        subject = Subject.objects.get(id=request.data["subject"])
        user = User.objects.get(id=request.data["user"])

        profile = user.profile

        profile.subjects.remove(subject)

        return Response({})
