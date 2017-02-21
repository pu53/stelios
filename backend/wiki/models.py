from django.db import models
from django.contrib.auth.models import User

# Create your models here.

SUBJECT_CHOICES = [(1,"TDT4140 - programutvikling"), (2,"TTM4100 - kommunikasjon tjenester og nett"),]


class Subject(models.Model):
    name = models.CharField(choices = SUBJECT_CHOICES, max_length=140, default='fugletitting')
    description = models.TextField(default='')

class Topic(models.Model):
    name = models.CharField(max_length = 140, default='kappa')
    description = models.TextField(default='')
    subject = models.ManyToManyField(Subject)

class SubTopic(models.Model):
    name = models.CharField(max_length = 140,default='kappa')
    description = models.TextField(default='')
    topics = models.ManyToManyField(Topic)
    content = models.TextField(default='')
