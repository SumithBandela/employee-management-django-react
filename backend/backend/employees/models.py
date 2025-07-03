from django.db import models

# Create your models here.

class Employee(models.Model):
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone = models.IntegerField()
    salary = models.DecimalField(max_digits=10,decimal_places=2)
    designation = models.CharField(max_length=255)
    photo = models.FileField(upload_to='media/uploads/')
    joined_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)