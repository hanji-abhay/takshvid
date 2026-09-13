from django.urls import path
from .views import SubjectListView, NoteListView, BookListView

urlpatterns = [
    path('subjects/<int:course_id>/<int:semester>/', SubjectListView.as_view(), name='subject-list'),
    path('notes/<int:subject_id>/', NoteListView.as_view(), name='note-list'),
    path('books/<int:subject_id>/', BookListView.as_view(), name='book-list'),
]