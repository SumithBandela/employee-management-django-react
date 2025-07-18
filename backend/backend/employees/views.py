from django.shortcuts import render
from .serializers import EmployeeSerializer,SignUpSerializer,ChangePasswordSerializer,ForgotPasswordSerializer,VerifyOtpSerializer,ResetPasswordSerializer
from .models import Employee
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.core.mail import send_mail
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import passwordResetOtp
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import random
import csv
from .utils import send_welcome_mail
import os
from django.utils.timezone import now
# Create your views here.
class DashboardApiView(APIView):
    def get(self,request):
        today = now().date()

        data = {
            "total_users":User.objects.count(),
            "new_signups_today":User.objects.filter(date_joined__date=today).count(),
            "total_employees":Employee.objects.count()
        }
        return Response(data)
class EmployeeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        search_query = request.GET.get('search', '')  
      
        employees = Employee.objects.filter(
            Q(firstname__icontains=search_query) |
            Q(lastname__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(designation__icontains=search_query)
        ).order_by('-id')

       
        paginator = PageNumberPagination()
        paginator.page_size = 5
        result_page = paginator.paginate_queryset(employees, request)

        
        serializer = EmployeeSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self,request):
        serializer = EmployeeSerializer(data = request.data)
        if serializer.is_valid():
            employee = serializer.save()
            file_path = os.path.join('media/uploads/files','1744360808.pdf')
            send_welcome_mail(employee.firstname,'bsumith209@gmail.com',file_path)
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
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
     serializer = ForgotPasswordSerializer(data = request.data)
     if serializer.is_valid():
         email = serializer.validated_data['email']
         try:
             user = User.objects.get(email = email)
         except User.DoesNotExist:
            return Response({'error':'user with email does not exist'},status=400)

         otp = str(random.randint(100000,999999))    
         passwordResetOtp.objects.create(user=user,otp=otp)

         send_mail(
             subject = 'Your otp for password reset',
             message=f'your otp is {otp}. it will expire in 10 minutes',
             from_email='sumithbandela@gmail.com',
             recipient_list=[email]
         )
         return Response({'message':'otp sent to your email'},status=200)
     return Response(serializer.errors,status=400)
    
class VerifyOtpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOtpSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']

            try:
                user = User.objects.get(email=email)
                otp_entry = passwordResetOtp.objects.filter(user=user, otp=otp).latest('created_at')
                if otp_entry.is_expired():
                    return Response({'error': 'OTP expired'}, status=400)
                return Response({'message': 'OTP verified'}, status=200)
            except (User.DoesNotExist, passwordResetOtp.DoesNotExist):
                return Response({'error': 'Invalid OTP or email'}, status=400)

        return Response(serializer.errors, status=400)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']

            try:
                user = User.objects.get(email=email)
                otp_entry = passwordResetOtp.objects.filter(user=user, otp=otp).latest('created_at')
                if otp_entry.is_expired():
                    return Response({'error': 'OTP expired'}, status=400)

                user.set_password(new_password)
                user.save()

                passwordResetOtp.objects.filter(user=user).delete()

                return Response({'message': 'Password reset successful'}, status=200)
            except (User.DoesNotExist, passwordResetOtp.DoesNotExist):
                return Response({'error': 'Invalid email or OTP'}, status=400)

        return Response(serializer.errors, status=400)
    
class ExportEmployeeCSV(APIView):
    def get(self,request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename = "employees.csv"'
        writer = csv.writer(response)
        writer.writerow([
            'First Name', 'Last Name', 'Email', 'Phone',
            'Salary', 'Designation', 'Joined Date'
        ])

        employees = Employee.objects.all()
        for emp in employees:
            writer.writerow([
                emp.firstname,
                emp.lastname,
                emp.email,
                emp.phone,
                emp.salary,
                emp.designation,
                emp.joined_date
            ])
        return response
    
class ExportEmployeePDF(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition']  = "attachment; filename = 'employees.pdf'"

        p = canvas.Canvas(response,pagesize=A4)
        width, height= A4

        p.setFont("Helvetica-Bold", 14)
        p.drawString(50,height-50,"Employee List")
        p.setFont("Helvetica", 11)
        y = height - 80

        employees = Employee.objects.all()
        for emp in employees:
            line = f"{emp.firstname} {emp.lastname} | {emp.email} | {emp.designation} | {emp.salary} | Joined: {emp.joined_date}"
            p.drawString(50, y, line)
            y -= 20
            if y < 50:
                p.showPage()
                y = height - 50

        p.save()
        return response
