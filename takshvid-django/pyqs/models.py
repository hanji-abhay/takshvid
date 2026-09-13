from django.db import models

# Create your models here.
from subjects.models import Subject

class PYQ(models.Model):
    EXAM_TYPE_CHOICES = [
        ('mid', 'Mid Semester'),
        ('end', 'End Semester'),
        ('internal', 'Internal Assessment'),
        ('practical', 'Practical Exam'),
    ]

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='pyqs'
    )
    year = models.IntegerField()
    exam_type = models.CharField(
        max_length=20,
        choices=EXAM_TYPE_CHOICES
    )
    file_url = models.URLField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    uploaded_by = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-year']
        verbose_name = 'PYQ'
        verbose_name_plural = 'PYQs'

    def __str__(self):
        return f"{self.subject.name} - {self.year} - {self.exam_type}"