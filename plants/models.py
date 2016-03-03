from __future__ import unicode_literals
from django.db import models

from django.contrib.auth.hashers import (
    check_password, make_password, is_password_usable)

class Plant(models.Model):

    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True, null=True)
    cost = models.FloatField(default=0.0)


class Stakeholder(models.Model):

    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=128)

    REQUIRED_FIELDS = ['password']
    USERNAME_FIELD = 'email'

    def get_username(self):
        "Return the identifying username for this User"
        return self.email

    def __str__(self):
        return self.get_username()

    def natural_key(self):
        return (self.get_username(),)

    def is_authenticated(self):
        """
        Always return True. This is a way to tell if the user has been
        authenticated in templates.
        """
        return True

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """
        Returns a boolean of whether the raw_password was correct. Handles
        hashing formats behind the scenes.
        """
        def setter(raw_password):
            self.set_password(raw_password)
            self.save(update_fields=["password"])
        return check_password(raw_password, self.password, setter)

    def set_unusable_password(self):
        # Sets a value that will never be a valid hash
        self.password = make_password(None)

    def has_usable_password(self):
        return is_password_usable(self.password)

    def get_full_name(self):
        raise NotImplementedError()

    def get_short_name(self):
        raise NotImplementedError()


class Order(models.Model):

    last_updated = models.DateTimeField(null=True, blank=True)
    done = models.BooleanField(default=False)
    stakeholder = models.ForeignKey(Stakeholder, related_name="orders", on_delete=models.CASCADE )


class OrderItem(models.Model):

    plant = models.ForeignKey(Plant)
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE )


