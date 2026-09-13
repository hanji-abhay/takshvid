from django.urls import path
from .views import StateListView, UniversityListView, CourseListView

urlpatterns = [
    path('states/', StateListView.as_view(), name='state-list'),
    path('universities/<int:state_id>/', UniversityListView.as_view(), name='university-list'),
    path('courses/<int:university_id>/', CourseListView.as_view(), name='course-list'),
]