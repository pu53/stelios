from rest_framework import serializers
from profiles.models import Profile
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('study', 'subjects')

class UserSerializer(serializers.ModelSerializer):
    #profile = serializers.PrimaryKeyRelatedField(many=False, queryset=Profile.objects.all())
    #profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ('id', 'username')


class ProfileDataSerializer(serializers.Serializer):
    pass
