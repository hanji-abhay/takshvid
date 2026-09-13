from django.contrib import admin
from .models import PYQ

# Register your models here.
@admin.register(PYQ)
class PYQAdmin(admin.ModelAdmin):
    list_display = ['subject', 'year', 'exam_type', 'is_verified']
    list_filter = ['exam_type', 'year', 'is_verified']
    search_fields = ['subject__name']