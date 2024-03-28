# Create your views here.
from urllib import response
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import (
    authentication_classes,
    permission_classes,
    api_view,
)
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from django.shortcuts import get_object_or_404

from Users.models import MyUser
from .models import Entry, Journal


@api_view(["get"])
def sampleEntry(request):
    entry = [
        {
            "user_id": 1,
            "entry_id": 1,
            "creation_date": "2021-09-30",
            "title": "Title One",
            "content": "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        },
        {
            "user_id": 1,
            "entry_id": 2,
            "creation_date": "2021-09-30",
            "title": "Title Two",
            "content": "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        },
        {
            "user_id": 1,
            "entry_id": 3,
            "creation_date": "2021-09-30",
            "title": "Title Three",
            "content": "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        },
    ]
    return Response(entry, status=status.HTTP_200_OK)


@api_view(["get"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def test_user(request):
    user = request.user
    return Response(
        {"message": f"Hello {user.user_id}! You are logged in"},
        status=status.HTTP_200_OK,
    )


@api_view(["get"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_all_entries(request):
    user = request.user
    journal = Journal.objects.get(user_id=user.user_id)
    entries = journal.get_all_entries()
    response = []
    for entry in entries:
        response.append(
            {
                "user_id": user.user_id,
                "entry_id": entry.entry_id,
                "creation_date": entry.creation_date,
                "title": entry.title,
                "content": entry.content,
            }
        )
    if len(response) == 0:
        return Response(
            {"error": "No entries found for this user."},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(response, status=status.HTTP_200_OK)


@api_view(["post"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_entry(request) -> Response:
    user = request.user
    if not Journal.objects.filter(user_id=user).exists():
        return Response(
            {"error": "Journal does not exist for this user."},
            status=status.HTTP_404_NOT_FOUND,
        )

    journal = Journal.objects.get(user_id=user)

    entry = Entry(
        journal_id=journal,
        title=request.data["title"],
        content=request.data["content"],
    )
    entry.save()
    return Response(
        {"message": "Entry created successfully"}, status=status.HTTP_201_CREATED
    )


@api_view(["get"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_entry(request):
    user = request.user
    if not Journal.objects.filter(user_id=user).exists():
        return {"error": "can't find user's journal"}

    journal = Journal.objects.get(user_id=user)

    entry_id = request.data["entry_id"]

    if not Entry.objects.filter(journal_id=journal, entry_id=entry_id).exists():
        return Response(
            {"error": "Entry does not exist for this user."},
            status=status.HTTP_404_NOT_FOUND,
        )

    entry = Entry.objects.get(journal_id=journal, entry_id=entry_id)
    entry.delete()
    return Response(
        {"message": "Entry deleted successfully"}, status=status.HTTP_200_OK
    )


@api_view(["get"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_journal_statistics(request):
    try:
        user = request.user
        if not Journal.objects.filter(user_id=user).exists():
            return Response(
                {"error": "Journal does not exist for this user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        journal = Journal.objects.get(user_id=user)
        most_active_month_int = journal.get_most_active_month()
        average_entries_per_week = journal.get_average_entries_per_week()
        total_word_count = journal.get_total_word_count()

        match most_active_month_int:
            case 1:
                most_active_month = "January"
            case 2:
                most_active_month = "February"
            case 3:
                most_active_month = "March"
            case 4:
                most_active_month = "April"
            case 5:
                most_active_month = "May"
            case 6:
                most_active_month = "June"
            case 7:
                most_active_month = "July"
            case 8:
                most_active_month = "August"
            case 9:
                most_active_month = "September"
            case 10:
                most_active_month = "October"
            case 11:
                most_active_month = "November"
            case 12:
                most_active_month = "December"
            case _:
                most_active_month = "No entries found"

        return Response(
            {
                "most_active_month": most_active_month,
                "average_entries_per_week": average_entries_per_week,
                "total_word_count": total_word_count,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["get"])
def get_daily_scheduled_email_users(request):
    """
    This method to get the list of users who have email_prompt set to True. I wrote this method to test wether I could get the list of users who have email_prompt set to True through calling the API. This works as expected so now I use this code in my email app.
    """

    users = MyUser.objects.all()
    user_list = [user.email for user in users if user.email_prompt is True]

    print(user_list)
    return Response(
        {
            "users": user_list,
        },
        status=status.HTTP_200_OK,
    )
