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

# Existing OrderSerializer remains for compatibility
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price_per_unit', 'subtotal']
    
    def get_subtotal(self, obj):
        return obj.subtotal

class OrderItemDetailSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'quantity', 'price_per_unit', 'subtotal']
    
    def get_subtotal(self, obj):
        return obj.subtotal


class OrderHistorySerializer(serializers.ModelSerializer):
    status = serializers.CharField(source='order_status.status_name', read_only=True)
    items = serializers.SerializerMethodField()
    order_id = serializers.IntegerField(source='id')  # Alias id as order_id to match frontend
    order_status_id = serializers.PrimaryKeyRelatedField(source='order_status', read_only=True)
    itemCount = serializers.SerializerMethodField()
    total_amount = serializers.FloatField()  # Explicitly define as FloatField
    
    class Meta:
        model = Order
        fields = [
            'order_id', 
            'user_id',
            'order_date', 
            'total_amount', 
            'order_status_id', 
            'tracking_number', 
            'shipping_address_id',
            'items',
            'itemCount',
            'status'  # Add this field to the list
        ]
    
    def get_items(self, obj):
        order_items = OrderItem.objects.filter(order=obj)
        return OrderItemDetailSerializer(order_items, many=True).data
    
    def get_itemCount(self, obj):
        return OrderItem.objects.filter(order=obj).count()

class PaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentStatus
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


