from __future__ import unicode_literals

from django.contrib.auth import authenticate, login

from rest_framework.authtoken.models import Token
from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

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


class GetOrder( generics.ListCreateAPIView, CurrentUserMixin):
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


class Items( generics.ListCreateAPIView ):
    permission_classes = [IsAuthenticated]
    model = OrderItem
    serializer_class = OrderItemSerializer


class UpdateOrderItem( generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    model = OrderItem
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()


class Inventory( generics.ListAPIView ):
    permission_classes = [AllowAny]
    model = Plant
    serializer_class = PlantSerializer
    queryset = Plant.objects.all()


class Register( generics.CreateAPIView):
    permission_classes = [AllowAny]
    model = Stakeholder
    serializer_class = AccountSerializer

    def post(self, request):
        stk = Stakeholder.objects.create_user(email = request.data['email'])
        stk.set_password(request.data['password'])
        stk.save()
        token = Token.objects.create(user=stk)
        result = {
            'token': token.key,
            'email': stk.email,
            'id' : stk.pk,
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
                    'email' : user.email,
                    'id' : user.pk,
                    'name' : user.name,
                    'phone' : user.phone,
                    'volunteer' : user.voluntter,
                    'times': user.times
                }

                return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print e

        return Response(
            {'detail': 'Failed to login'}, status=status.HTTP_400_BAD_REQUEST)