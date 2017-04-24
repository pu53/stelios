from django.contrib.auth.models import User
from wiki.models import Subject, Topic, Subtopic
from wiki.serializers import SubjectSerializer, TopicSerializer, SubtopicSerializer, SubjectOnlyTopicIdAndNameSerializer, SubjectWithoutSubtopicsSerializer, SubjectNameSerializer
from rest_framework import generics
import json

class SubjectList(generics.ListCreateAPIView):
    queryset = Subject.objects.all().order_by('id')
    serializer_class = SubjectSerializer

class SubjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all().order_by('id')
    serializer_class = SubjectSerializer

class SubjectOnlyTopicIdAndNameList(generics.ListCreateAPIView):
    queryset = Subject.objects.all().order_by('id')
    serializer_class = SubjectOnlyTopicIdAndNameSerializer

class SubjectOnlyTopicIdAndNameDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all().order_by('id')
    serializer_class = SubjectOnlyTopicIdAndNameSerializer

class SubjectWithoutSubtopicsList(generics.ListCreateAPIView):
    queryset = Subject.objects.all().order_by('id')
    serializer_class = SubjectWithoutSubtopicsSerializer

class SubjectWithoutSubtopicsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all().order_by('id')
    serializer_class = SubjectWithoutSubtopicsSerializer

class TopicList(generics.ListCreateAPIView):
    queryset = Topic.objects.all().order_by('id')
    serializer_class = TopicSerializer


class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all().order_by('id')
    serializer_class = TopicSerializer

class SubtopicList(generics.ListCreateAPIView):
    queryset = Subtopic.objects.all().order_by('id')
    serializer_class = SubtopicSerializer

class SubtopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subtopic.objects.all().order_by('id')
    serializer_class = SubtopicSerializer
