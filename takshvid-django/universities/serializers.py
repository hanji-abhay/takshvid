from rest_framework import serializers
from .models import State, University, Course

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name', 'code']


class UniversitySerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='state.name', read_only=True)

    class Meta:
        model = University
        fields = [
            'id', 'name', 'state', 'state_name',
            'type', 'established', 'website', 'logo'
        ]


class CourseSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'code', 'university',
            'university_name', 'level',
            'duration_years', 'total_semesters'
        ]