from __future__ import unicode_literals
from datetime import datetime

from django.db import models
from django.contrib.auth.hashers import (
    check_password, make_password, is_password_usable)

from managers import StakeholderManager

class Plant(models.Model):

    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    cost = models.FloatField(default=0.0)
    sun= models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True)
    color_preference = models.BooleanField(default=False)
    color_limits = models.CharField(max_length=255, blank=True, null=True)
    notes = models.CharField(max_length=255, blank=True, null=True)
    img_url = models.CharField(max_length=255, blank=True, null=True)
    marketing = models.CharField(max_length=255, blank=True, null=True)


class Stakeholder(models.Model):

    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(auto_now=True)
    objects = StakeholderManager()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, blank=True, null=True)
    name = models.CharField(max_length=128, blank=True, null=True)
    volunteer = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    is_authenticated = models.BooleanField(default=True)
    times = models.CharField(max_length=128, blank=True, null=True)

    REQUIRED_FIELDS = ['password']
    USERNAME_FIELD = 'email'

    def get_username(self):
        "Return the identifying username for this User"
        return self.email

    def __str__(self):
        return self.get_username()

    def natural_key(self):
        return (self.get_username(),)

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
        return self.get_short_name()

    def get_short_name(self):
        return self.email

    def has_module_perms(self, label):
        return True

    def has_perm(self, label):
        return True


class Order(models.Model):

    done = models.BooleanField(default=False)
    stakeholder = models.ForeignKey(Stakeholder, related_name="orders", on_delete=models.CASCADE )
    charge_data = models.CharField(max_length=100, blank=True, null=True)
    charge_date = models.DateTimeField(blank=True, null=True)

    @property
    def last_updated(self):
        for item in self.items.all():
           return item.updated
        return datetime.now()

    @property
    def email(self):
        return self.stakeholder.email

    @property
    def total(self):
        cost = 0
        for item in self.items.all():
            cost += item.qty * item.plant.cost
        return cost


class OrderItem(models.Model):

    plant = models.ForeignKey(Plant)
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE )
    qty = models.IntegerField(default=1)
    color = models.CharField(max_length=200, blank=True, null=True)
    updated = models.DateTimeField(auto_now=True)

    @property
    def plant_type(self):
        return self.plant.type

    @property
    def plant_name(self):
        return self.plant.name

    @property
    def total(self):
        return self.qty * self.plant.cost


