from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from core.models import User
from core.serializers import UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user_obj = User.objects.get(email=email)
        if user_obj.password != password:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    request.session['user_id'] = user_obj.id
    return JsonResponse(UserSerializer(user_obj).data)

@api_view(['POST'])
def logout_view(request):
    request.session.flush()
    return JsonResponse({'success': True})

@api_view(['GET'])
def me_view(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'Not authenticated'}, status=401)

    try:
        user_obj = User.objects.get(id=user_id)
        return JsonResponse(UserSerializer(user_obj).data)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
