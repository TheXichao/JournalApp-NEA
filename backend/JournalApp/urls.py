from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("user/", include("Users.urls")),
    path("entry/", include("Entries.urls")),
]
