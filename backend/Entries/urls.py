from . import views
from django.urls import re_path

#
urlpatterns = [
    re_path("sample/", views.sampleEntry, name="sample entry"),
    re_path("testUser/", views.test_user, name="test user"),
    re_path("getEntries/", views.get_all_entries, name="get all entries"),
    re_path("createEntry/", views.create_entry, name="create entry"),
    re_path(
        "getScheduledUsers/",
        views.get_daily_scheduled_email_users,
        name="get scheduled email users",
    ),
    re_path("deleteEntry/", views.delete_entry, name="delete entry"),
    re_path(
        "getJournalStatistics/",
        views.get_journal_statistics,
        name="get entry statistics",
    ),
]
