from . import views
from django.urls import re_path

urlpatterns = [
    re_path("register/", views.register_view, name="api_register"),
    re_path("login/", views.login_view, name="api_login"),
    re_path("logout/", views.logout_view, name="api_logout"),
    re_path("test_user/", views.test_user, name="test_user"),
    # re_path("update_email_prompt/", views.update_email_prompt, name="email_prompt"),
    # path("session/", views.session_view, name="api_session"),
]
