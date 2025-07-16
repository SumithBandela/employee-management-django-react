from django.urls import path
from .views import EmployeeView,EmployeeDetail,SignUpView,LoginView,ChangePasswordView,VerifyOtpView,ResetPasswordView,ForgotPasswordView

urlpatterns = [
    path('employees/',EmployeeView.as_view()),
    path('employees/<int:pk>/',EmployeeDetail.as_view()),
    path('login/',LoginView.as_view(),name='login'),
    path('signup/',SignUpView.as_view(),name='signup'),
    path('change-password/',ChangePasswordView.as_view(),name='change-password'),
    path('forgot-password/',ForgotPasswordView.as_view()),
    path('verify-otp/',VerifyOtpView.as_view()),
    path('reset-password/',ResetPasswordView.as_view())
]

