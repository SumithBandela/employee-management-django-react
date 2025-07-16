from rest_framework import serializers
from .models import Employee
from django.contrib.auth.models import User
import uuid
import base64
from django.core.files.base import ContentFile

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
    
class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            try:
                format, imgstr = data.split(';base64,')
                ext = format.split('/')[-1]
                filename = str(uuid.uuid4())[:10] 
                data = ContentFile(base64.b64decode(imgstr), name=f"{filename}.{ext}")
            except Exception as e:
                raise serializers.ValidationError("Invalid image data")
        return super().to_internal_value(data)


class EmployeeSerializer(serializers.ModelSerializer):
    photo = Base64ImageField()
    class Meta:
        model = Employee
        fields = [
            "id",
            "firstname",
            "lastname",
            "email",
            "phone",
            "salary",
            "designation",
            "photo",
            "joined_date",
            "created_at",
            "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)
