from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from app1.models import Employee
from app2.models import Client

# Create your views here.

class ConbinedDataView(APIView):

    def get(self,request):
        employees = Employee.objects.using('default').all().values('name','email')
        clients = Client.objects.using('second').all().values('name','company')

        return Response({
            "employees":employees,
            "clients":clients
        })