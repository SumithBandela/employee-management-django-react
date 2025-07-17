from django.urls import path
from .views import ConbinedDataView
urlpatterns = [
    path('combined/',ConbinedDataView.as_view())
 ]