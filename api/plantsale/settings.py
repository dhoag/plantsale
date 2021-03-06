"""
Django settings for plantsale project.
"""

import os
import dj_database_url

BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'v$+$6%)li2dpqhtoz$$^jt05bfw8b@5k(_4br-esm+7%za9#(*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*',]

# Application definition
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'rest_framework.authtoken',
    'plants',
)

MIDDLEWARE = (
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)
ROOT_URLCONF = 'plantsale.urls'

WSGI_APPLICATION = 'plantsale.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DB_HOST = str(os.environ.get('POSTGRES_SERVICE_HOST'))
DB_PORT = str(os.environ.get('POSTGRES_SERVICE_PORT'))
DB_PASS = str(os.environ.get('POSTGRES_PASSWORD'))
## Default to a linked container called DB_1. Only used if DATABASE_URL isn't set
DOCKER_DB_URL = 'postgres://docker:{0}@{1}/docker'.format( DB_PASS, os.environ.get('DB_1_PORT_5432_TCP_ADDR', DB_HOST+ ':' + DB_PORT) )
STRIPE_KEY = os.environ.get('STRIPE_KEY', "sk_test_zjKOcAlbiR2ltU6xo9E7FBGK")
print (STRIPE_KEY[:-12])

# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
DATABASES = {
    'default': dj_database_url.config( default=DOCKER_DB_URL )
}
DATABASES['default']['CONN_MAX_AGE'] = 1060

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

AUTH_USER_MODEL = 'plants.Stakeholder'

DATETIME_FORMAT = '%Y-%m-%dT%H:%M:%SZ'


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            # insert your TEMPLATE_DIRS here
            os.path.join(BASE_DIR,  'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
            'debug': DEBUG,
        },
    },
]

# CORSHEADERS SETTINGS
CORS_ORIGIN_ALLOW_ALL = True

REST_FRAMEWORK = {
    'PAGINATE_BY': 40,
    'PAGINATE_BY_PARAM': 'page_size',
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
    'DATETIME_FORMAT': DATETIME_FORMAT,
    'DATETIME_INPUT_FORMAT': DATETIME_FORMAT,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {
            'format': 'localhost next-tier: %(asctime)s %(levelname)s %(message)s',
        },
        'request': {
            'format': 'localhost next-tier: %(asctime)s %(levelname)s %(status_code)d %(message)s -> %(request)s',
        },
        'sql': {
            'format': 'localhost next-tier: %(asctime)s %(levelname)s duration: %(duration)d SQL: %(sql)s',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        }
   },
}
