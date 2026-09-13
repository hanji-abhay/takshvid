from django.db import models

# Create your models here.
from universities.models import Course

class Subject(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, null=True, blank=True)
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='subjects'
    )
    semester = models.IntegerField()
    credits = models.IntegerField(default=4)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['semester', 'name']

    def __str__(self):
        return f"{self.name} - Sem {self.semester}"


class Note(models.Model):
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    title = models.CharField(max_length=200)
    chapter_number = models.IntegerField(null=True, blank=True)
    content_url = models.URLField(null=True, blank=True)
    content_text = models.TextField(null=True, blank=True)
    uploaded_by = models.IntegerField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['chapter_number']

    def __str__(self):
        return f"{self.title} - {self.subject.name}"


class Book(models.Model):
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='books'
    )
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    open_library_id = models.CharField(max_length=50, null=True, blank=True)
    cover_url = models.URLField(null=True, blank=True)
    is_free = models.BooleanField(default=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return f"{self.title} by {self.author}"