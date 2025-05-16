from core.models import User

class SimpleSessionAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user_id = request.session.get('user_id')
        if user_id:
            try:
                user_obj = User.objects.get(pk=user_id)
                request.user = AuthenticatedUser(user_obj)
            except User.DoesNotExist:
                request.user = CustomAnonymousUser()
        else:
            request.user = CustomAnonymousUser()

        return self.get_response(request)


class AuthenticatedUser:
    def __init__(self, user):
        self._user = user

    def __getattr__(self, attr):
        return getattr(self._user, attr)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        # Ensure the user has this column in the DB (optional fallback)
        return getattr(self._user, 'is_active', True)


class CustomAnonymousUser:
    @property
    def is_authenticated(self):
        return False

    @property
    def is_active(self):
        return False
