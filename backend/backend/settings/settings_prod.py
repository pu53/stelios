import os
import random
from .base import *
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False 

ALLOWED_HOSTS = ['stelios.no', 'www.stelios.no', '146.185.153.19', 'localhost']

STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
STATIC_URL = '/api/static/'
# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'stelios_backend',
        'USER': 'stelios_user',
        'PASSWORD': os.environ.get('stelios_db_password'),
        'HOST': '',
        'PORT': '',
    }
}

# SECURITY WARNING: keep the secret key used in product
"""
Two things are wrong with Django's default `SECRET_KEY` system:
1. It is not random but pseudo-random
2. It saves and displays the SECRET_KEY in `settings.py`
This snippet
1. uses `SystemRandom()` instead to generate a random key
2. saves a local `secret.txt`
The result is a random and safely hidden `SECRET_KEY`.
"""
try:
    SECRET_KEY
except NameError:
    SECRET_FILE = os.path.join(BASE_DIR, 'secret.txt')
    try:
        SECRET_KEY = open(SECRET_FILE).read().strip()
    except IOError:
        try:
            import random
            SECRET_KEY = ''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(50)])
            secret = open(SECRET_FILE, 'w')
            secret.write(SECRET_KEY)
            secret.close()
        except IOError:
            Exception('Please create a %s file with random characters \
            to generate your secret key!' % SECRET_FILE)
