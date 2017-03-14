from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from rest_framework.authtoken.models import Token
import wiki
# Create your models here.

# kommentert ut da sudy og year ikke er viktige. kan tas ed senere if need be
# STUDY_PROGRAM_CHOICES = [(1,"Datateknologi - 5 årig master"), (2,"Datateknologi - 2 årig master"),]

class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	study = models.CharField(max_length=100, default='MTDT')
	#year = models.IntegerField(default='0')
	#subjects = models.ManyToManyField("wiki.Subject", blank=True, related_name='profile')
	def __str__(self):
		return(self.user.username)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
