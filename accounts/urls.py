from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path
from accounts.views import RegisterView, LogoutView

urlpatterns = [
    path('login/', obtain_auth_token, name='accounts_login'),
    path('register/', RegisterView.as_view(), name='accounts_register'),
    path('logout/', LogoutView.as_view(), name='accounts_logout'),
]
