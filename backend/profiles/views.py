from django.contrib.auth.models import User
from profiles.serializers import UserSerializer
from wiki.serializers import SubjectSerializer, SubjectInfoSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserSubjects(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get(self, request, pk, format = None):
        user = User.objects.get(id = pk)
        profile = user.profile
        #profile = user.profile
        subjects = profile.subjects.all()

        user_serializer = UserSerializer(user)
        user_data = user_serializer.data

        #subject_serializer = SubjectSerializer(subjects, many = True)
        #subject_data = subject_serializer.data

        #user_data.update(subject_data)
        subject_list = []

        for sub in subjects:
            subject_serializer = SubjectInfoSerializer(sub)
            subject_list.append(subject_serializer.data)


        content = {'subjects': subject_list}
        user_data.update(content)

        return Response(user_data)
