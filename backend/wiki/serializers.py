from rest_framework import serializers
from wiki.models import Subject, Topic, SubTopic
from django.contrib.auth.models import User

class SubTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTopic
        fields = ('name', 'description', 'content', 'created_by')

class TopicSerializer(serializers.ModelSerializer):
    sub_topics = SubTopicSerializer(many=True, read_only = True)
    class Meta:
        model = Topic
        fields = ('name','description', 'sub_topics')

class SubjectSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True)
    class Meta:
        model = Subject
        fields = ('id','name','description','topics')

    def create(self, validated_data):
        print(validated_data)
        topics_data = validated_data.pop('topics')
        subject = Subject.objects.create(**validated_data)
        for topic_data in topics_data:
            Topic.objects.create(subject=subject, **topic_data)
        return subject
