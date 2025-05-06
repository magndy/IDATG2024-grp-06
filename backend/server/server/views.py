from django.http import HttpResponse

from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

def index(request):
    return HttpResponse("Hello, this is the index view.")

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()  # SQL → Python objects
    serializer_class = ProductSerializer  # Python → JSON