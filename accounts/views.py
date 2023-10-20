from rest_framework.response import Response
from rest_framework.views import APIView, status
from accounts.serialziers import UserSerializer
from accounts.permissions import IsUser


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(request.data)
        if serializer.is_valid():
            serializer.create(request.data)
            return Response(data={"message": "Done"})
        else:
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LogoutApiView(APIView):
    permission_classes = [IsUser]

    def post(self, request):
        request.user.auth_token.delete()
        response = Response(
            data={"message": "Done."},
            status=status.HTTP_204_NO_CONTENT
        )
        response.delete_cookie("token")
        return response
