from .base import *

DEBUG = True
SECRET_KEY = 'x@i2ur#15nyp&us--6dbl)2c2)_6&r6a#55ih9&9x)yt5r07)('

STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
STATIC_URL = '/static/'

ALLOWED_HOSTS = ['.stelios.no', '146.185.153.19', 'localhost', '127.0.0.1']

# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'stelios_backend',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
