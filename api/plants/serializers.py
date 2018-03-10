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


class AccountSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField()
    email = serializers.CharField()
    token = serializers.CharField()
    name = serializers.CharField()
    phone = serializers.CharField()
    volunteer = serializers.BooleanField()
    times = serializers.CharField()


class StakeholderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Stakeholder
        fields = ('id', 'email', 'name', 'phone', 'volunteer', 'times')

class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = ('id', 'order', 'plant', 'plant_name', 'plant_type', 'color', 'qty', 'updated')


class AllOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, allow_empty=True, allow_null=True)
    stakeholder = StakeholderSerializer()

    class Meta:
        model = Order
        fields = ('id', 'email', 'last_updated', 'items', 'total', 'done', 'charge_data', 'stakeholder')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, allow_empty=True, allow_null=True)

    class Meta:
        model = Order
        fields = ('id', 'email', 'last_updated', 'items', 'total', 'charge_data', 'done')


class PlantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plant
        fields = '__all__'


