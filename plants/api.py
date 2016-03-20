from __future__ import unicode_literals

from urllib3 import request
from datetime import datetime
from django.contrib.auth import authenticate, login

from rest_framework.authtoken.models import Token
from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

import stripe

from models import Stakeholder, Plant, Order, OrderItem
from serializers import AccountSerializer, LoginSerializer, PlantSerializer, OrderSerializer, \
    OrderItemSerializer, StakeholderSerializer


class CurrentUserMixin(object):
    def get_queryset(self):
        try:
            return Stakeholder.objects.get(pk=self.request.user.pk)
        except Exception:
            return Stakeholder.objects.none()

    def get_object(self):
        return self.get_queryset()


class PayOrder(generics.UpdateAPIView, CurrentUserMixin):
    permission_classes = [IsAuthenticated]
    model = Order
    serializer_class = OrderSerializer

    def post(self,request, *args, **kwargs):
        # Set your secret key: remember to change this to your live secret key in production
        # See your keys here https://dashboard.stripe.com/account/apikeys
        stripe.api_key = "sk_test_zjKOcAlbiR2ltU6xo9E7FBGK"

        # Get the credit card details submitted by the form
        token = request.DATA['token']
        order_id = kwargs['order_id']

        order = Order.objects.get(id=order_id)
        if order.stakeholder != self.request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Create the charge on Stripe's servers - this will charge the user's card
        try:
            charge = stripe.Charge.create(
                    amount=2000,  # amount in cents, again
                    currency="usd",
                    source=token,
                    description="Example charge"
            )
            order.charge_data = charge
            order.charge_date = datetime.now()
            order.done = True
            order.save()
            return Response(OrderSerializer(order).data, status.HTTP_202_ACCEPTED)
        except stripe.error.CardError, e:
            print e
            # The card has been declined
            return Response({'detail': e.message}, status=status.HTTP_400_BAD_REQUEST)


class GetOrder(generics.ListCreateAPIView, CurrentUserMixin):
    permission_classes = [IsAuthenticated]
    model = Order
    serializer_class = OrderSerializer

    def get_queryset(self):
        orders = Order.objects.filter(stakeholder=self.request.user)
        if orders.count() == 0:
            order = Order()
            order.stakeholder = self.request.user
            order.save()

        return Order.objects.filter(stakeholder=self.request.user)


class Items(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    model = OrderItem
    serializer_class = OrderItemSerializer


class UpdateOrderItem(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    model = OrderItem
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()


class Inventory(generics.ListAPIView):
    permission_classes = [AllowAny]
    model = Plant
    serializer_class = PlantSerializer
    queryset = Plant.objects.all()


class Register(generics.CreateAPIView):
    permission_classes = [AllowAny]
    model = Stakeholder
    serializer_class = AccountSerializer

    def post(self, request):
        stk = Stakeholder.objects.create_user(email=request.data['email'])
        stk.set_password(request.data['password'])
        stk.save()
        token = Token.objects.create(user=stk)
        result = {
            'token': token.key,
            'email': stk.email,
            'id': stk.pk,
            'volunteer': False
        }

        return Response(result, status=status.HTTP_200_OK)


class UpdateAccount(CurrentUserMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    model = Stakeholder
    serializer_class = StakeholderSerializer
    queryset = Stakeholder.objects.all()


class Login(CurrentUserMixin, generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    model = Stakeholder
    serializer_class = LoginSerializer

    def post(self, request):

        try:
            user = authenticate(
                    username=request.data['email'],
                    password=request.data['password'])

            if user:
                login(request, user)

                token = Token.objects.get(user__pk=user.pk)

                result = {
                    'token': token.key,
                    'email': user.email,
                    'id': user.pk,
                    'name': user.name,
                    'phone': user.phone,
                    'volunteer': user.volunteer,
                    'times': user.times
                }

                return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print e

        return Response(
                {'detail': 'Failed to login'}, status=status.HTTP_400_BAD_REQUEST)
