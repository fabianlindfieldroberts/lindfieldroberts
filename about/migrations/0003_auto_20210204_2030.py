# Generated by Django 3.1.5 on 2021-02-04 20:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0002_auto_20210204_0815'),
    ]

    operations = [
        migrations.AlterField(
            model_name='highscore',
            name='userName',
            field=models.CharField(max_length=11),
        ),
    ]