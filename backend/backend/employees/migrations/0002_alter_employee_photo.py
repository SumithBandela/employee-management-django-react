# Generated by Django 5.2.4 on 2025-07-03 15:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='photo',
            field=models.FileField(upload_to='media/uploads/'),
        ),
    ]
