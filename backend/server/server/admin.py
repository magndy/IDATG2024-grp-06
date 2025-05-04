from django.contrib import admin
from .models import Brand, Category, Product, ProductImage, Address, User, ShoppingCart, CartItem, OrderStatus, Order, OrderItem, PaymentStatus, Payment

admin.site.register(Brand)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(Address)
admin.site.register(User)
admin.site.register(ShoppingCart)
admin.site.register(CartItem)
admin.site.register(OrderStatus)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(PaymentStatus)
admin.site.register(Payment)
