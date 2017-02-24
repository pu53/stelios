from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Subject(models.Model):
    name = models.CharField(max_length=140, default='musikk')
    description = models.TextField(default='')
    def __str__(self):
        return(self.name)

class Topic(models.Model):
    name = models.CharField(max_length = 140, default='Kæppæ')
    description = models.TextField(default='')
    subjects = models.ManyToManyField(Subject, blank=True, related_name='topics')
    def __str__(self):
        return(self.name)

class Subtopic(models.Model):
    name = models.CharField(max_length = 140,default='Kæppe')
    description = models.TextField(default='')
    content = models.TextField(default='')
    topics = models.ManyToManyField(Topic, blank=True, related_name='subtopics')
    def __str__(self):
        return(self.name)
