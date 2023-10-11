from rest_framework.permissions import IsAuthenticated


class IsUser(IsAuthenticated):
    def has_permission(self, request, view):
        default_permission = super().has_permission(request, view)
        return default_permission and not request.user.is_superuser


class IsManager(IsAuthenticated):
    def has_permission(self, request, view):
        default_permission = super().has_permission(request, view)
        return default_permission and request.user.is_superuser
