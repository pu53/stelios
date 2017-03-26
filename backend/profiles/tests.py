from django.test import TestCase
from rest_framework.test import APITestCase
from .models import Profile
from django.contrib.auth.models import User


class UserModelTest(TestCase):

    def test_string_representation(self):
        user = User(username="My name")
        profile = Profile(user = user)
        self.assertEqual(str(profile), user.username)
