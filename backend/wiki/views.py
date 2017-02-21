from django.contrib.auth.models import User
from wiki.models import Subject, Topic, SubTopic
from wiki.serializers import SubjectSerializer, TopicSerializer, SubTopicSerializer
from rest_framework import generics

class SubjectList(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class SubjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class TopicList(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def get_queryset(self):
        if self.request.method == 'GET':
            pk_list = self.request.GET.get('list_of_pk')
            if pk_list:
                queryset = Topic.objects.filter(pk__in=pk_list)
            else:
                queryset = Topic.objects.all()
        else:
            queryset = Topic.objects.all()
        return queryset

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

class SubTopicList(generics.ListCreateAPIView):
    queryset = SubTopic.objects.all()
    serializer_class = SubTopicSerializer

class SubTopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubTopic.objects.all()
    serializer_class = SubTopicSerializer
