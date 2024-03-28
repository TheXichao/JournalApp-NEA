from rest_framework import serializers
from Users.models import MyUser


class MyUserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = MyUser
        fields = [
            "user_id",
            "first_name",
            "last_name",
            "email",
            "password",
        ]
