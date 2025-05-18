from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import User, Address, City
from django.db import transaction
from django.contrib.auth.hashers import make_password

@csrf_exempt
def register_user(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    try:
        data = json.loads(request.body)

        # Get or create city
        city_name = data['address']['city']
        postal_code = data['address']['postalCode']
        country = data['address']['country']
        city, _ = City.objects.get_or_create(
            city_name=city_name,
            postal_code=postal_code,
            country=country
        )

        # Create address
        address = Address.objects.create(
            address_line=data['address']['line'],
            city=city
        )

        # Create user
        with transaction.atomic():
            user = User.objects.create(
                first_name=data['firstName'],
                last_name=data['lastName'],
                email=data['email'],
                phone=data['phone'],
                password=make_password(data['password']),  # hash the password
                address=address
            )

        return JsonResponse({'message': 'User registered successfully'}, status=201)

    except Exception as e:
        print("Registration error:", e)
        return JsonResponse({'error': str(e)}, status=400)
