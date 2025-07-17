from django.shortcuts import render
from rest_framework.views import APIView
from .models import Post
from rest_framework.response import Response
from .serializers import PostSerailizer
from rest_framework import status
# Create your views here.

class PostList(APIView):
    
    def get(self,request):
        posts = Post.objects.all()
        serializer = PostSerailizer(posts,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = PostSerailizer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,  status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class PostDetail(APIView):
    
    def getObject(self,pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return None
        
    def get(self,request,pk):
        post = self.getObject(pk)
        if not post:
            return Response({'error','post not found'},status=status.HTTP_404_NOT_FOUND)
        serializer = PostSerailizer(post)
        return Response(serializer.data)
    
    def put(self,request,pk):
        post = self.getObject(pk)
        if not post:
            return Response({'error','post not found'},status=status.HTTP_404_NOT_FOUND)
        serializer = PostSerailizer(post,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):
        post = self.getObject(pk)
        if not post:
            return Response({'error','post not found'})
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
        