from django.db import models

# Create your models here.
class State(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class University(models.Model):
    TYPE_CHOICES = [
        ('central', 'Central University'),
        ('state', 'State University'),
        ('private', 'Private University'),
        ('deemed', 'Deemed University'),
        ('institute', 'Institute of National Importance'),
    ]

    name = models.CharField(max_length=200)
    state = models.ForeignKey(
        State,
        on_delete=models.CASCADE,
        related_name='universities'
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    established = models.IntegerField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    logo = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Universities'

    def __str__(self):
        return self.name


class Course(models.Model):
    LEVEL_CHOICES = [
        ('undergraduate', 'Undergraduate'),
        ('postgraduate', 'Postgraduate'),
        ('diploma', 'Diploma'),
        ('certificate', 'Certificate'),
        ('phd', 'PhD'),
    ]

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, null=True, blank=True)
    university = models.ForeignKey(
        University,
        on_delete=models.CASCADE,
        related_name='courses'
    )
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    duration_years = models.IntegerField(default=3)
    total_semesters = models.IntegerField(default=6)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.university.name}"