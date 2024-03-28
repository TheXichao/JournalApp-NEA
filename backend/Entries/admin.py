from django.contrib import admin

# Register your models here.
from .models import Journal, Entry

admin.site.register(Journal)
admin.site.register(Entry)
