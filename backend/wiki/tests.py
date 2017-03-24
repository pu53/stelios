from django.test import TestCase
from rest_framework.test import APITestCase
from .models import Subject, Topic, Subtopic


class SubjectModelTest(TestCase):

    def test_string_representation(self):
        subject = Subject(name="My entry subject")
        self.assertEqual(str(subject), subject.name)


    def test_invalid_url(self):
        subject = Subject.objects.create(name="name", description="description")
        response = self.client.get("/0000/00/00/0-invalid/")
        self.assertEqual(response.status_code, 404)


class TopicModelTest(TestCase):

    def test_string_representation(self):
        topic = Topic(name="My entry topic")
        self.assertEqual(str(topic), topic.name)


class SubtopicModelTest(TestCase):

    def test_string_representation(self):
        subtopic = Subtopic(name="My entry subtopic")
        self.assertEqual(str(subtopic), subtopic.name)

#coverage run ./manage.py test
