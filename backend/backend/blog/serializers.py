from rest_framework import serializers
from .models import Post

class PostSerailizer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

        def __str__(self):
            return self.title