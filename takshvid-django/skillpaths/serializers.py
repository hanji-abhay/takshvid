from rest_framework import serializers
from .models import SkillPath, SkillModule, Quiz

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = [
            'id', 'question', 'option_a',
            'option_b', 'option_c', 'option_d',
            'correct_option', 'explanation'
        ]

class SkillModuleSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)

    class Meta:
        model = SkillModule
        fields = [
            'id', 'title', 'order_number', 'content',
            'estimated_minutes', 'has_quiz',
            'has_coding_exercise', 'quizzes'
        ]

class SkillPathSerializer(serializers.ModelSerializer):
    modules = SkillModuleSerializer(many=True, read_only=True)

    class Meta:
        model = SkillPath
        fields = [
            'id', 'title', 'slug', 'description',
            'difficulty', 'icon_url', 'total_modules',
            'estimated_hours', 'modules'
        ]

class SkillPathListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillPath
        fields = [
            'id', 'title', 'slug', 'description',
            'difficulty', 'icon_url', 'total_modules',
            'estimated_hours'
        ]