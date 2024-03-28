from django.test import TestCase
from .models import Journal, Entry
from Users.models import MyUser


class JournalModelTests(TestCase):
    def setUp(self):
        self.user = MyUser.objects.create_user(
            email="test@test.com", password="password"
        )

    # test if an entry asssociated with the user is created automatically using a signal
    def test_create_journal(self):
        journal = Journal.objects.get(user_id=self.user)
        self.assertEqual(journal.user_id, self.user)
        self.assertEqual(journal.get_all_entries().count(), 0)

    def test_create_entry(self):
        journal = Journal.objects.get(user_id=self.user)
        entry = Entry.objects.create(journal_id=journal, content="first entry")
        self.assertEqual(entry.journal_id, journal)
        self.assertEqual(journal.get_all_entries().count(), 1)

    def test_get_all_entries(self):
        journal = Journal.objects.get(user_id=self.user)
        entry1 = Entry.objects.create(journal_id=journal, content="first entry")
        entry2 = Entry.objects.create(journal_id=journal, content="second entry")
        self.assertEqual(journal.get_all_entries().count(), 2)
