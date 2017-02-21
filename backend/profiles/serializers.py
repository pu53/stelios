from rest_framework import serializers
from profiles.models import Profile, STUDY_PROGRAM_CHOICES

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id','study','year')
