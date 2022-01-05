from django.urls import path
from .views import *
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth import views as auth_views
import debug_toolbar
from django.urls import include, path
urlpatterns = [
    path('', HomePageView.as_view(), name='Home'),
    path('__debug__/', include(debug_toolbar.urls)),
]
