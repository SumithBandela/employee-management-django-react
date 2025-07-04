from django.shortcuts import render
from .serializers import EmployeeSerializer,SignUpSerializer
from .models import Employee
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class EmployeeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = EmployeeSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"employee created"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class EmployeeDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self,pk): 
        try:
            return Employee.objects.get(pk=pk)
        except:
            raise Http404
        
    def get(self,request,pk):
        employee = self.get_object(pk)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    
    def put(self,request,pk):
        employee = self.get_object(pk)
        serializer = EmployeeSerializer(employee,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):
        employee = self.get_object(pk)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class SignUpView(APIView):
    def post(self,request):
        serializer = SignUpSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"signup successful"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username,password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access":str(refresh.access_token),
                "refresh":str(refresh)
            },status=status.HTTP_200_OK)
        return Response({"error":"Invalid username or password"},status=status.HTTP_401_UNAUTHORIZED)
