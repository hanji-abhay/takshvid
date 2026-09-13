from django.db import models

# Create your models here.
class SkillPath(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='beginner'
    )
    icon_url = models.URLField(null=True, blank=True)
    total_modules = models.IntegerField(default=0)
    estimated_hours = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class SkillModule(models.Model):
    skill = models.ForeignKey(
        SkillPath,
        on_delete=models.CASCADE,
        related_name='modules'
    )
    title = models.CharField(max_length=200)
    order_number = models.IntegerField()
    content = models.TextField()
    estimated_minutes = models.IntegerField(default=15)
    has_quiz = models.BooleanField(default=False)
    has_coding_exercise = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order_number']

    def __str__(self):
        return f"{self.skill.title} - {self.title}"


class Quiz(models.Model):
    module = models.ForeignKey(
        SkillModule,
        on_delete=models.CASCADE,
        related_name='quizzes'
    )
    question = models.TextField()
    option_a = models.CharField(max_length=200)
    option_b = models.CharField(max_length=200)
    option_c = models.CharField(max_length=200, null=True, blank=True)
    option_d = models.CharField(max_length=200, null=True, blank=True)
    correct_option = models.CharField(max_length=1)
    explanation = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Quiz - {self.module.title}"