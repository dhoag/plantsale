# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-20 22:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plants', '0008_auto_20160313_2015'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='charge_data',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='charge_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
