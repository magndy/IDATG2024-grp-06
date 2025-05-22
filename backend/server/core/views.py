from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db import transaction
from rest_framework import viewsets, filters
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Category,Product, ProductImage, Address, User,City,
    ShoppingCart, CartItem, OrderStatus, Order, OrderItem,
    PaymentStatus, Payment 
)
from .serializers import (
    CategorySerializer, ProductSerializer, ProductImageSerializer,
    AddressSerializer, UserSerializer, ShoppingCartSerializer, CartItemSerializer,
    OrderStatusSerializer, OrderSerializer, OrderItemSerializer,
    PaymentStatusSerializer, PaymentSerializer,
    # Add these if you're using them
    OrderItemDetailSerializer, OrderHistorySerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class OrderItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

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

@api_view(['POST'])
@transaction.atomic
def checkout(request):
    data = request.data

    try:
        # 1. Handle city
        city_name = data['address']['city']
        postal_code = data['address']['postalCode']
        country = data['address']['country']

        city, _ = City.objects.get_or_create(
            city_name=city_name,
            postal_code=postal_code,
            country=country
        )

        # 2. Create address
        address = Address.objects.create(
            address_line=data['address']['street'],
            city=city
        )

        # 3. Create or get user
        email = data['contact']['email']
        user, _ = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': data['address']['firstName'],
                'last_name': data['address']['lastName'],
                'phone': data['address']['phone'],
                'address': address,
                'password': 'notsecure',
                'is_active': True,
            }
        )

        # 4. Get order status from your predefined DB values
        try:
            default_status = OrderStatus.objects.get(status_name='PROCESSING')
        except OrderStatus.DoesNotExist:
            return Response(
                {'message': 'Order status "PROCESSING" not found in the database.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Create the order
        order = Order.objects.create(
            user=user,
            total_amount=data['totalAmount'],
            order_status=default_status,
            shipping_address=address
        )

        # 6. Create order items
        for item in data['items']:
            try:
                product = Product.objects.get(pk=item['productId'])
            except Product.DoesNotExist:
                return Response(
                    {'message': f'Product with ID {item["productId"]} not found.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity'],
                price_per_unit=item['pricePerUnit']
            )

        # ✅ Success response
        return Response(
            {'message': 'Order placed successfully', 'order_id': order.id},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {'message': f'Internal server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = []
    search_fields = ['id']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('userid', None)
        
        if user_id:
            # Filter orders by user ID
            queryset = queryset.filter(user_id=user_id)
        
        # Order by date (newest first)
        queryset = queryset.order_by('-order_date')
        
        return queryset
    
    def get_serializer_class(self):
        # Use OrderHistorySerializer when history parameter is present or userid is in the query
        if self.request.query_params.get('history', False) or self.request.query_params.get('userid', None):
            return OrderHistorySerializer
        return OrderSerializer


class PaymentStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PaymentStatus.objects.all()
    serializer_class = PaymentStatusSerializer


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
