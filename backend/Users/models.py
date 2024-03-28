from django.db import models
from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin

from .utils import clean_email, hash_password, validate_email, verify_password

# Create your models here.


def check_email_and_password(email: str, password: str | None) -> bool:
    if password is None:
        raise ValueError("Password is not valid")
    if not validate_email(email):
        raise ValueError("Email is not valid")
    return True


class MyUserManager(UserManager):
    def create_user(self, email, password=None, **extra_fields):
        cleaned_email = clean_email(email)
        is_valid = check_email_and_password(cleaned_email, password)
        if is_valid:
            user = self.model(email=cleaned_email, **extra_fields)
            user.set_password(password)
            user.save()
            return user

    def create_superuser(self, email, password=None, **extra_fields):
        cleaned_email = clean_email(email)
        is_valid = check_email_and_password(cleaned_email, password)
        if is_valid:
            user = self.model(email=cleaned_email, **extra_fields)
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            return user


class MyUser(AbstractBaseUser, PermissionsMixin):
    """A Users table used to store the data of my user a subclass implementing the default User model"""

    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    creation_date = models.DateField(auto_now_add=True)
    first_name = models.CharField(max_length=30, null=True)
    last_name = models.CharField(max_length=30, null=True)
    email_prompt = models.BooleanField(default=False, null=True)

    # By convention, the manager attribute are named objects.
    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def get_full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def set_password(self, raw_password: str) -> None:
        self.password = hash_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return verify_password(raw_password, self.password)
