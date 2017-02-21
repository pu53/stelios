from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class SubTopic(models.Model):
    name = models.CharField(max_length = 140,default='kappa')
    description = models.TextField(default='')
    content = models.TextField(default='')
    def __str__(self):
        return(self.name)

class Topic(models.Model):
    name = models.CharField(max_length = 140, default='kappa')
    description = models.TextField(default='')
    sub_topics = models.ManyToManyField(SubTopic, blank=True, related_name='subtopics')
    def __str__(self):
        return(self.name)

class Subject(models.Model):
    name = models.CharField(max_length=140, default='fugletitting')
    description = models.TextField(default='')
    topic = models.ManyToManyField(Topic, blank=True, related_name='topics')
    def __str__(self):
        return(self.name)
