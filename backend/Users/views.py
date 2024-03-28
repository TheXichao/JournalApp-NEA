from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from .serializers import MyUserSerializer
from .models import MyUser


@api_view(["POST"])
def register_view(request) -> Response:
    serializer = MyUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user = MyUser.objects.get(email=request.data["email"])
        user.set_password(request.data["password"])
        user.save()
        token = Token.objects.create(user=user)
        response_data = {
            "user_id": user.user_id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "authToken": token.key,
            "email_prompt": user.email_prompt,
        }
        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login_view(request) -> Response:
    try:
        user = MyUser.objects.get(email=request.data["email"])
        if user.check_password(request.data["password"]):
            token, created = Token.objects.get_or_create(user=user)
            user_data = MyUserSerializer(user).data
            user_data["token"] = token.key
            response_data = {
                "user_id": user.user_id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "authToken": token.key,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST
            )

    except MyUser.DoesNotExist:
        return Response(
            {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
def logout_view(request) -> Response:
    return Response({})


@api_view(["GET"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def test_user(request) -> Response:
    return Response(f"Hello {request.user.email}")


@api_view(["POST"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def update_email_prompt(request) -> Response:
    user = request.user
    user.email_prompt = request.data["email_prompt"]
    user.save()
    return Response(
        {"message": f"Prompt updated successfully to {user.email_prompt}"},
        status=status.HTTP_201_CREATED,
    )
