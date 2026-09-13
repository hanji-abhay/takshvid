from rest_framework import serializers
from .models import Subject, Note, Book

class SubjectSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'code', 'course',
            'course_name', 'semester', 'credits'
        ]


class NoteSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'subject', 'subject_name',
            'chapter_number', 'content_url',
            'content_text', 'is_verified', 'created_at'
        ]


class BookSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'subject',
            'subject_name', 'open_library_id',
            'cover_url', 'is_free'
        ]