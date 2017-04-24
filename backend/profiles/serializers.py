from rest_framework import serializers
from profiles.models import Profile
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('study', 'subjects', 'professor')

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ('id', 'username', 'profile')

#Serializer to create a user via signup. Profile is not created here
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','password','first_name','last_name','email')

    def create(self, validated_data):
        print(validated_data)
        print(validated_data.get('password'))
        if validated_data.get('password'):
            validated_data['password'] = make_password(
                validated_data['password']
            )
        user = get_user_model().objects.create(**validated_data)
        return user

class UserIDNameSerializer(serializers.ModelSerializer):
	profile = ProfileSerializer()
	class Meta:
		model = User
		fields = ('id', 'profile')
