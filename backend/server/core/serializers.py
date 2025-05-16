from rest_framework import serializers
from .models import (
    Brand, Category, Product, ProductImage, Address, User,
    ShoppingCart, CartItem, OrderStatus, Order, OrderItem,
    PaymentStatus, Payment
)

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = '__all__'

    def get_parent(self, obj):
        if obj.parent:
            return CategorySerializer(obj.parent).data
        return None

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(source='productimage_set', many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'




class AddressSerializer(serializers.ModelSerializer):
    city = serializers.CharField(source='city.city_name', read_only=True) 
    class Meta:
        model = Address
        fields = ['address_line', 'city']


class UserSerializer(serializers.ModelSerializer):
    address_line = serializers.SerializerMethodField()
    city_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'email', 'phone', 'role',
            'address_line', 'city_name'
        ]

    def get_address_line(self, obj):
        return obj.address.address_line if obj.address else ""

    def get_city_name(self, obj):
        return obj.address.city.city_name if obj.address and obj.address.city else ""


class ShoppingCartSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShoppingCart
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


# Calculates subtotal
class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price_per_unit', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal


class PaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentStatus
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
