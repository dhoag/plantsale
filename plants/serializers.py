from rest_framework import serializers

from .models import Stakeholder, Plant, Order, OrderItem

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


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = ('id', 'order', 'plant', 'color', 'qty', 'updated')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, allow_empty=True, allow_null=True)

    class Meta:
        model = Order
        fields = ('id', 'last_updated', 'items', 'done')


class PlantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plant


