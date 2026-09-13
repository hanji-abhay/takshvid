from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import State, University, Course
from .serializers import StateSerializer, UniversitySerializer, CourseSerializer

# Create your views here.
class StateListView(generics.ListAPIView):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    permission_classes = [AllowAny]

class UniversityListView(generics.ListAPIView):
    serializer_class = UniversitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        state_id = self.kwargs.get('state_id')
        return University.objects.filter(
            state_id=state_id,
            is_active=True
        )

class CourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        university_id = self.kwargs.get('university_id')
        return Course.objects.filter(
            university_id=university_id,
            is_active=True
        )