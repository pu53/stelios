from rest_framework import serializers
from wiki.models import Subject, Topic, Subtopic
from django.contrib.auth.models import User

class SubtopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtopic
        fields = ('__all__')

class TopicSerializer(serializers.ModelSerializer):
    subtopics = SubtopicSerializer(required=False, many=True, read_only=True)
    class Meta:
        model = Topic
        fields = ('__all__')

class SubjectSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(required=False, many=True, read_only=True)
    class Meta:
        model = Subject
        fields= ('__all__')
#    def create(self, validated_data):
#        print(validated_data)
#        topics_data = validated_data.pop('topics')
#        subject = Subject.objects.create(**validated_data)
##        for topic_data in topics_data:
##            Topic.objects.create(subject=subject, **topic_data)
#        return subject
