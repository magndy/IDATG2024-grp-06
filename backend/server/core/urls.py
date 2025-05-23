from django.urls import path, include
from .views_auth import csrf,login_view, logout_view, me_view 
from .views_register import register_user
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,ProductViewSet, ProductImageViewSet,checkout,
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
    path('login/', login_view),
    path('logout/', logout_view),
    path('me/', me_view),
    path('csrf/', csrf),
    path('register/', register_user),
    path('checkout/',checkout),
    path('', include(router.urls)),
]
