from django.contrib import admin

# Register your models here.
from .models import MyUser


class MyUserAdmin(admin.ModelAdmin):
    list_display = ("user_id", "email", "first_name", "last_name", "is_staff")


admin.site.register(MyUser, MyUserAdmin)
