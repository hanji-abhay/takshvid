from django.urls import path
from .views import PYQListView

urlpatterns = [
    path('pyqs/<int:subject_id>/', PYQListView.as_view(), name='pyq-list'),
]