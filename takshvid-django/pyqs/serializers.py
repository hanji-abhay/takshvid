from rest_framework import serializers
from .models import PYQ

class PYQSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = PYQ
        fields = [
            'id', 'subject', 'subject_name',
            'year', 'exam_type', 'file_url',
            'is_verified', 'created_at'
        ]