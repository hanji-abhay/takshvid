from django.contrib import admin
from .models import SkillPath, SkillModule, Quiz
# Register your models here.
@admin.register(SkillPath)
class SkillPathAdmin(admin.ModelAdmin):
    list_display = ['title', 'difficulty', 'total_modules', 'is_active']
    list_filter = ['difficulty', 'is_active']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title',)}

@admin.register(SkillModule)
class SkillModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'skill', 'order_number', 'has_quiz', 'has_coding_exercise']
    list_filter = ['has_quiz', 'has_coding_exercise']
    search_fields = ['title']

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['question', 'module', 'correct_option']
    search_fields = ['question']