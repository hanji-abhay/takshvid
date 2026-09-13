from django.contrib import admin
from .models import Subject, Note, Book
# Register your models here.
@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'course', 'semester', 'is_active']
    list_filter = ['semester', 'is_active']
    search_fields = ['name', 'code']

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'chapter_number', 'is_verified']
    list_filter = ['is_verified']
    search_fields = ['title']

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'subject', 'is_free']
    list_filter = ['is_free']
    search_fields = ['title', 'author']