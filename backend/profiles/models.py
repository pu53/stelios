from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.

STUDY_PROGRAM_CHOICES = [(1,"Datateknologi - 5 årig master"), (2,"Datateknologi - 2 årig master"),]

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    study = models.CharField(choices = STUDY_PROGRAM_CHOICES, max_length=100, default='dragvoll')
    year = models.IntegerField(choices = [(i,i) for i in range(8)], default='0')

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
