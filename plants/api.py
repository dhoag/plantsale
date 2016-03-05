from __future__ import unicode_literals

from django.contrib.auth import authenticate, login

from rest_framework.authtoken.models import Token
from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

from models import Stakeholder


class CurrentUserMixin(object):

    def get_queryset(self):
        try:
            return Stakeholder.objects.get(pk=self.request.user.pk)
        except Exception:
            return Stakeholder.objects.none()

    def get_object(self):
        return self.get_queryset()


class Register( generics.CreateAPIView):
    permission_classes = [AllowAny]
    model = Stakeholder

    def post(self, request):
        stk = Stakeholder.objects.create_user(email = request.data['email'])
        stk.set_password(request.data['password'])
        stk.save()
        token = Token.objects.create(user=stk)
        result = {
            'token': token.key,
            'id' : stk.pk
        }

        return Response(result, status=status.HTTP_200_OK)


class Login(CurrentUserMixin, generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    model = Stakeholder

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
                      'id' :user.pk
                }

                return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print e

        return Response(
            {'detail': 'Failed to login'}, status=status.HTTP_400_BAD_REQUEST)