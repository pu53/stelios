from rest_framework import serializers
from wiki.models import Subject, Topic, Subtopic
from django.contrib.auth.models import User
from drf_queryfields import QueryFieldsMixin


class SubtopicSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    class Meta:
        model = Subtopic
        fields = ('__all__')

class SubtopicNameIDSerializer(serializers.ModelSerializer):
	class Meta:
		model =  Subtopic
		fields = ('name', 'id')

class SubtopicNameSerializer(serializers.ModelSerializer):
	class Meta:
		model =  Subtopic
		fields = ('name',)

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

class SubjectInfoSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields= ('id', 'name', 'description')


class TopicOnlyIdAndNameSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id','name')

class SubjectOnlyTopicIdAndNameSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    topics = TopicOnlyIdAndNameSerializer(required=False, many=True, read_only=True)
    class Meta:
        model = Subject
        fields = ('__all__')

class TopicWithoutSubtopicsSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id', 'name', 'description', 'subjects')

class SubjectWithoutSubtopicsSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    topics = TopicWithoutSubtopicsSerializer(required=False, many=True, read_only=True)
    class Meta:
        model = Subject
        fields = ('__all__')


class SubjectNameSerializer(QueryFieldsMixin,serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('name', )
