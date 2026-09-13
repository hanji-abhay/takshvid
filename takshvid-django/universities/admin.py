from django.contrib import admin
from .models import State, University, Course
# Register your models here.
@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ['name', 'code']
    search_fields = ['name', 'code']

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ['name', 'state', 'type', 'is_active']
    list_filter = ['type', 'state', 'is_active']
    search_fields = ['name']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'university', 'level', 'duration_years', 'is_active']
    list_filter = ['level', 'is_active']
    search_fields = ['name']