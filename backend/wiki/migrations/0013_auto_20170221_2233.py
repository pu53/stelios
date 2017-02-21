# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-21 21:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wiki', '0012_auto_20170221_2230'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subtopic',
            name='topics',
            field=models.ManyToManyField(blank=True, related_name='subtopics', to='wiki.Topic'),
        ),
        migrations.AlterField(
            model_name='topic',
            name='subjects',
            field=models.ManyToManyField(blank=True, related_name='topics', to='wiki.Subject'),
        ),
    ]