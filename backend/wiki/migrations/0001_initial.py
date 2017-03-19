# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-02-24 10:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='musikk', max_length=140)),
                ('description', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='Subtopic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Kæppe', max_length=140)),
                ('description', models.TextField(default='')),
                ('content', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Kæppæ', max_length=140)),
                ('description', models.TextField(default='')),
                ('subjects', models.ManyToManyField(blank=True, related_name='topics', to='wiki.Subject')),
            ],
        ),
        migrations.AddField(
            model_name='subtopic',
            name='topics',
            field=models.ManyToManyField(blank=True, related_name='subtopics', to='wiki.Topic'),
        ),
    ]
