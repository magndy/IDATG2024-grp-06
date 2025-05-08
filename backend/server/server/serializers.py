# serializers.py
from rest_framework import serializers
from .models import Product, Brand, Category

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)        # Override the brand field
    category = CategorySerializer(read_only=True)  # Override the category field
    class Meta:
        model = Product
        fields = '__all__'