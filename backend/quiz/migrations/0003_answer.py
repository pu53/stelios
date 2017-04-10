# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-06 15:05
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '__first__'),
        ('quiz', '0002_auto_20170324_1322'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('choiceID', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='Answer_Choice', to='quiz.Choice')),
                ('questionID', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='Answer_Question', to='quiz.Question')),
                ('quizID', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='Answer_Quiz', to='quiz.Quiz')),
                ('userID', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='Answer_User', to='profiles.Profile')),
            ],
        ),
    ]