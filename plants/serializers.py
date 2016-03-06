from rest_framework import serializers

from .models import Stakeholder

class EmailLowercase(object):

    """
    Helper object to make sure emails are stored in lower case.
    """

    def validate_email(self, attrs, source):
        value = attrs[source]
        attrs[source] = value.lower()
        return attrs

class LoginSerializer(EmailLowercase, serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)


class AccountSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    email = serializers.CharField()
    token = serializers.CharField()


