from rest_framework import serializers
from wiki.models import Subject, Topic, Subtopic
from django.contrib.auth.models import User
from drf_queryfields import QueryFieldsMixin


class SubtopicSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    class Meta:
        model = Subtopic
        fields = ('__all__')

class TopicSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    subtopics = SubtopicSerializer(required=False, many=True, read_only=True)
    class Meta:
        model = Topic
        fields = ('__all__')

class SubjectSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    topics = TopicSerializer(required=False, many=True, read_only=True)
    class Meta:
        model = Subject
        fields= ('__all__')

class TopicOnlyIdAndNameSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id','name')

class SubjectOnlyTopicIdAndNameSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    topics = TopicOnlyIdAndNameSerializer(required=False, many=True, read_only=True)
    class Meta:
        model = Subject
        fields = ('__all__')

#    def create(self, validated_data):
#        print(validated_data)
#        topics_data = validated_data.pop('topics')
#        subject = Subject.objects.create(**validated_data)
##        for topic_data in topics_data:
##            Topic.objects.create(subject=subject, **topic_data)
#        return subject
