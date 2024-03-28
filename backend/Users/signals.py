from .models import MyUser, MyUserManager
from Entries.models import Journal

from django.dispatch import receiver
from django.db.models.signals import post_save


@receiver(post_save, sender=MyUser)
def create_journal(sender, instance, created, **kwargs):
    if created:
        Journal.objects.create(user_id=instance)
        instance.journal.save()
