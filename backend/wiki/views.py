from django.contrib.auth.models import User
from wiki.models import Subject, Topic, Subtopic
from wiki.serializers import SubjectSerializer, TopicSerializer, SubtopicSerializer, SubjectOnlyTopicIdAndNameSerializer
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

class TopicList(generics.ListCreateAPIView):
    queryset = Topic.objects.all().order_by('id')
    serializer_class = TopicSerializer


#    def get_queryset(self):
#        print(self.request.method)
#        if self.request.method == 'POST':
#            print("yes")
#            print(self.request)
#            received_json_data=json.loads(self.request.body)
#            print(received_json_data)
#            pk_list = self.request.GET.get('list_of_pk')
#            print(pk_list)
#            if pk_list:
#                queryset = Topic.objects.filter(pk__in=pk_list)
#            else:
#                queryset = Topic.objects.all()
#            print(queryset)
#        else:
#            queryset = Topic.objects.all()
#        return queryset
#
#class TopicSubsetList(generics.ListCreateAPIView):
#    serializer_class = TopicSerializer
#
#    def get_queryset(self):
#        lst = self.kwargs['topic_list']
#        print(lst)
#        queryset = Topic.objects.filter(pk__in=pk_list)
#        return queryset

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all().order_by('id')
    serializer_class = TopicSerializer

class SubtopicList(generics.ListCreateAPIView):
    queryset = Subtopic.objects.all().order_by('id')
    serializer_class = SubtopicSerializer

class SubtopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subtopic.objects.all().order_by('id')
    serializer_class = SubtopicSerializer
