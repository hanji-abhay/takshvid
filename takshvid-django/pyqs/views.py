from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import PYQ
from .serializers import PYQSerializer
# Create your views here.
class PYQListView(generics.ListAPIView):
    serializer_class = PYQSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        subject_id = self.kwargs.get('subject_id')
        return PYQ.objects.filter(
            subject_id=subject_id,
            is_verified=True
        )