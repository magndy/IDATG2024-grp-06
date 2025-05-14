from django.urls import path, include
from .views_auth import login_view, logout_view, me_view 
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,ProductViewSet,
    AddressViewSet, UserViewSet, ShoppingCartViewSet, CartItemViewSet,
    OrderStatusViewSet, OrderViewSet, OrderItemViewSet,
    PaymentStatusViewSet, PaymentViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'users', UserViewSet)
router.register(r'shopping-carts', ShoppingCartViewSet)
router.register(r'cart-items', CartItemViewSet)
router.register(r'order-statuses', OrderStatusViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'payment-statuses', PaymentStatusViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('api/login/', login_view, name='api-login'),
    path('api/logout/', logout_view, name='api-logout'),
    path('api/me/', me_view, name='api-me'),
    path('', include(router.urls)),
]
