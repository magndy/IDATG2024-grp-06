from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Category,Product, ProductImage, Address, User,
    ShoppingCart, CartItem, OrderStatus, Order, OrderItem,
    PaymentStatus, Payment
)
from .serializers import (
    CategorySerializer,ProductSerializer, ProductImageSerializer,
    AddressSerializer, UserSerializer, ShoppingCartSerializer, CartItemSerializer,
    OrderStatusSerializer, OrderSerializer, OrderItemSerializer,
    PaymentStatusSerializer, PaymentSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = []
    search_fields = ['name']
    
    def get_queryset(self):
        queryset = super().get_queryset()

        # Product-category query
        category = self.request.query_params.get('category', None)
        if category:
            # Use exact matching for category name
            queryset = queryset.filter(category__name=category)
        
        # Product-id query
        id = self.request.query_params.get('id', None)
        if id:
            queryset = queryset.filter(id=id)

        return queryset


class ProductImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer


class AddressViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ShoppingCartViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShoppingCart.objects.all()
    serializer_class = ShoppingCartSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = []
    search_fields = ['user']

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.query_params.get('userid', None)
        
        if user:
            # Use exact matching for category name
            queryset = queryset.filter(user_id=user)
            
        return queryset

class CartItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = []
    search_fields = ['cart']

    def get_queryset(self):
        queryset = super().get_queryset()
        cart = self.request.query_params.get('cartid', None)
        
        if cart:
            # Use exact matching for category name
            queryset = queryset.filter(cart_id=cart)
            
        return queryset




class OrderStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrderStatus.objects.all()
    serializer_class = OrderStatusSerializer


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


class PaymentStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PaymentStatus.objects.all()
    serializer_class = PaymentStatusSerializer


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
