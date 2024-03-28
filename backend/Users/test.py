from django.test import TestCase
from django.core.exceptions import ValidationError
from Users.models import MyUser
from .utils import validate_email, clean_email, hash_password, verify_password

from django.test import TestCase
from .utils import hash_password, verify_password, validate_email, clean_email


class UtilityFunctionTests(TestCase):

    def test_hash_password(self):
        password = "testpassword123"
        hashed_password = hash_password(password)
        self.assertIsInstance(hashed_password, str)
        self.assertTrue(":" in hashed_password)

    def test_verify_password(self):
        password = "testpassword123"
        hashed_password = hash_password(password)
        self.assertTrue(verify_password(password, hashed_password))

    def test_verify_password_incorrect(self):
        password = "testpassword123"
        incorrect_password = "wrongpassword"
        hashed_password = hash_password(password)
        self.assertFalse(verify_password(incorrect_password, hashed_password))

    def test_validate_email_valid(self):
        valid_email = "test@test.com"
        self.assertTrue(validate_email(valid_email))

    def test_validate_email_invalid(self):
        invalid_email = "not-an-email"
        self.assertFalse(validate_email(invalid_email))

    def test_clean_email_valid(self):
        valid_email = "test@test.com"
        self.assertEqual(clean_email(valid_email), valid_email)

    def test_clean_email_all_caps(self):
        test_email = "TEST@TEST.COM"
        self.assertEqual(clean_email(test_email), test_email.lower())

    def test_clean_email_with_extra_characters(self):
        valid_email = "      test@test.com  "
        self.assertEqual(clean_email(valid_email), "test@test.com")


class MyUserModelTests(TestCase):

    def test_create_user(self):
        email = "test@test.com"
        password = "password"
        user: MyUser = MyUser.objects.create_user(email=email, password=password)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_create_user_invalid_email(self):
        email = "not-an-email"
        password = "password"
        with self.assertRaises(ValueError):
            MyUser.objects.create_user(email=email, password=password)
