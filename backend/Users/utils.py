import hashlib
import os
import re


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    salted_password = salt + password.encode("utf-8")

    sha256_hash = hashlib.sha256()
    sha256_hash.update(salted_password)
    hashed_password = sha256_hash.hexdigest()

    return f"{salt.hex()}:{hashed_password}"


def verify_password(password: str, hashed_password: str) -> bool:
    salt, stored_hash = hashed_password.split(":")

    salted_password = bytes.fromhex(salt) + password.encode("utf-8")
    sha256_hash = hashlib.sha256()
    sha256_hash.update(salted_password)
    provided_hash = sha256_hash.hexdigest()

    return provided_hash == stored_hash


def validate_email(email: str) -> bool:
    # this regex basically means a@b.c where a, b, c are characters that are not @, [^@]+ means one or more characters that's not @ and is what the a, b, c are in my example.
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None


def clean_email(email: str) -> str:
    cleaned_email = re.search(r"[^@]+@[^@]+\.[^@]+", email)
    if cleaned_email is not None:
        # if things are found in the email pattern I defined above, return the first match in lowercase and stripped of any leading or trailing whitespace
        parsed_email =  cleaned_email.group(0)
        return parsed_email.lower().strip()
    else:
        return ""
