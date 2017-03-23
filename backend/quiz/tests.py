from django.test import TestCase
from rest_framework.test import APITestCase
from .models import Quiz, Question, Choice


class QuizModelTest(TestCase):

    def test_string_representation(self):
        quiz = Quiz(title="My entry quiz")
        self.assertEqual(str(quiz), quiz.title)


class QuestionModelTest(TestCase):

    def test_string_representation(self):
        question = Question(text="My entry question")
        self.assertEqual(str(question), question.text)



class ChoiceModelTest(TestCase):

    def test_string_representation(self):
        choice = Choice(choice_text="My entry choice")
        self.assertEqual(str(choice), choice.choice_text)
