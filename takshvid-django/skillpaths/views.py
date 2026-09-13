from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import SkillPath, SkillModule
from .serializers import (
    SkillPathSerializer,
    SkillPathListSerializer,
    SkillModuleSerializer
)

# Create your views here.
class SkillPathListView(generics.ListAPIView):
    serializer_class = SkillPathListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return SkillPath.objects.filter(is_active=True)

class SkillPathDetailView(generics.RetrieveAPIView):
    serializer_class = SkillPathSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return SkillPath.objects.filter(is_active=True)

class SkillModuleDetailView(generics.RetrieveAPIView):
    serializer_class = SkillModuleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return SkillModule.objects.filter(is_active=True)