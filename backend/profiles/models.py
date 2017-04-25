from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from rest_framework.authtoken.models import Token
import wiki
import quiz

class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	study = models.CharField(max_length=100, default='MTDT')
	subjects = models.ManyToManyField("wiki.Subject", blank=True, related_name='profile')
	quizes = models.ManyToManyField("quiz.Quiz", blank=True)
	answers = models.ManyToManyField("quiz.Answer", blank=True, related_name="answer_history")
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

	# WARNING WARNING WARNING proffesor is a dumb field to indicate that the user is a proffesor. This variable has NOTHING to do with permissions.
	#if a user is to be set to a professor it has to be done via the admin interface and set permissions there. These permissions
	#will determine if the user is authenticated and should be allow access to the backend. This variable here will only be an indication to
	#the frontend. Anyone could change this field, so do NOT use it for hard authentication.
	professor = models.BooleanField(default=False, blank=True)