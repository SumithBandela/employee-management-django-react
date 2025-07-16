from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
# Create your models here.

class Employee(models.Model):
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone = models.IntegerField()
    salary = models.DecimalField(max_digits=10,decimal_places=2)
    designation = models.CharField(max_length=255)
    photo = models.FileField(upload_to='uploads/')
    resume =  models.FileField(upload_to='uploads/resumes',null=True,blank=True)
    joined_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class passwordResetOtp(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at+timedelta(minutes=10)

    