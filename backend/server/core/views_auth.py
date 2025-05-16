from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from core.models import User
from core.serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.csrf import csrf_protect

# Expose CSRF token to frontend
@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"detail": "CSRF cookie set"})

# Login should remain csrf_exempt (token manually passed in header)
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    if not check_password(password, user.password):
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    request.session['user_id'] = user.id
    return JsonResponse(UserSerializer(user).data)

# Logout must be protected against CSRF since it mutates session
@csrf_protect
@api_view(['POST'])
def logout_view(request):
    request.session.flush()
    return JsonResponse({'success': True})

@api_view(['GET'])
def me_view(request):
    print("Session ID:", request.session.session_key)
    print("User from middleware:", request.user)

    user = request.user
    if not user or not user.is_authenticated:
        return JsonResponse({'error': 'Not authenticated'}, status=401)

    actual_user = getattr(user, '_user', user)  # Handles AuthenticatedUser wrapper
    return JsonResponse(UserSerializer(actual_user).data)