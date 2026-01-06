# api/urls.py
"""
Authentication URL Configuration

NOTE: Authentication routes have been consolidated to school/api/urls.py
The AuthViewSet in school/api/views.py handles all authentication:
    - POST /api/auth/login/   - User login
    - POST /api/auth/logout/  - User logout  
    - GET  /api/auth/me/      - Get current user info

This file is kept for potential future standalone API endpoints.
"""
from django.urls import path

urlpatterns = [
    # Authentication is handled by school.api.urls.py -> AuthViewSet
    # Add any additional standalone API endpoints here if needed
]