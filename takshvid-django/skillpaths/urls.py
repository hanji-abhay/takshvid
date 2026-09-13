from django.urls import path
from .views import SkillPathListView, SkillPathDetailView, SkillModuleDetailView

urlpatterns = [
    path('skills/', SkillPathListView.as_view(), name='skill-list'),
    path('skills/<slug:slug>/', SkillPathDetailView.as_view(), name='skill-detail'),
    path('skills/module/<int:pk>/', SkillModuleDetailView.as_view(), name='module-detail'),
]