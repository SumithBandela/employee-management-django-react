from django.urls import path
from .views  import TaskList,TaskDetail,Register,Login
urlpatterns = [
    path('tasks/',TaskList.as_view()),
    path('tasks/<int:pk>/',TaskDetail.as_view()),
    path('register/',Register.as_view()),
    path('login/',Login.as_view()),
]