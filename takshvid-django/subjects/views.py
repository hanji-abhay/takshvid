from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Subject, Note, Book
from .serializers import SubjectSerializer, NoteSerializer, BookSerializer

# Create your views here.
class SubjectListView(generics.ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        semester = self.kwargs.get('semester')
        return Subject.objects.filter(
            course_id=course_id,
            semester=semester,
            is_active=True
        )

class NoteListView(generics.ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        subject_id = self.kwargs.get('subject_id')
        return Note.objects.filter(
            subject_id=subject_id,
            is_verified=True
        )

class BookListView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        subject_id = self.kwargs.get('subject_id')
        return Book.objects.filter(
            subject_id=subject_id
        )