from django.shortcuts import render
from .models import Task
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .serializers import TaskSerailizer,UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class Register(APIView):
    def post(self,request):
        serializer = UserSerializer(data= request.data)
        if serializer.is_valid():
           user = serializer.save()
           token , _ = Token.objects.get_or_create(user=user)
           return Response({'token':token.key},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class Login(APIView):
    def post(self,request):
        user = authenticate(username=request.data.get('username'),password = request.data.get('password'))
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token':token.key})
        return Response({'error':'invalid Credentials'},status=status.HTTP_400_BAD_REQUEST)

class TaskList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        task  = Task.objects.filter(user=request.user)
        serializer = TaskSerailizer(task,many=True)
        return Response(serializer.data)


    def post(self,request):
        serializer = TaskSerailizer(data=request.data)
        if serializer.is_valid():
            serializer.save(user= request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class TaskDetail(APIView):
    permission_classes = [IsAuthenticated]
    def getObject(self,pk,user):
        try:
            return Task.objects.get(pk=pk,user=user)
        except Task.DoesNotExist:
            return None
        
    def put(self,request,pk):
        task = self.getObject(pk,request.user)
        if task.DoesNotExist:
            return Response({'error':'task not found'},status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerailizer(task,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):
        task = self.getObject(pk,request.user)
        if not task:
            return Response({'error':'task not found'},status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
