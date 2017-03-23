
from django.test import TestCase
from rest_framework.test import APITestCase
from .models import Subject, Topic, Subtopic


class SubjectModelTest(TestCase):

    def test_string_representation(self):
        subject = Subject(name="My entry subject")
        self.assertEqual(str(subject), subject.name)


class TopicModelTest(TestCase):

    def test_string_representation(self):
        topic = Topic(name="My entry topic")
        self.assertEqual(str(topic), topic.name)


class SubtopicModelTest(TestCase):

    def test_string_representation(self):
        subtopic = Subtopic(name="My entry subtopic")
        self.assertEqual(str(subtopic), subtopic.name)
