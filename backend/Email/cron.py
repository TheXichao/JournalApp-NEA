from Users.models import MyUser


def daily_scheduled_email():
    """
    Send the daily email to all users
    """

    users = MyUser.objects.all()
    user_list = [user.email for user in users if user.email_prompt is True]

    print(user_list)


def send_scheduled_email():
    print("hello world")
