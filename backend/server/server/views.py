from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from .models import Product, Brand
from .serializers import ProductSerializer, BrandSerializer

def index(request):
    return HttpResponse("Hello, this is the index view.")

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()  # SQL → Python objects
    serializer_class = ProductSerializer  # Python → JSON
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'brand']  # Change from 'categoryid' to 'category'
    search_fields = ['id', 'name', 'description']  # Added more useful search fields



class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()  # SQL → Python objects
    serializer_class = BrandSerializer  # Python → JSON

