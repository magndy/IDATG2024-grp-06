from django.db import models

class Brand(models.Model):
    id = models.AutoField(primary_key=True, db_column='brand_id')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    class Meta:
        managed = False
        db_table = 'brand'

class Category(models.Model):
    id = models.AutoField(primary_key=True, db_column='Category_id')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    class Meta:
        managed = False
        db_table = 'category'

class Product(models.Model):
    id = models.AutoField(primary_key=True, db_column='product_id')
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)  # Added null=True to match DB
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField()
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, db_column='brand_id', null=True)  # Added db_column and null=True
    category = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='category_id', null=True)  # Added db_column and null=True
    class Meta:
        managed = False
        db_table = 'product'

class ProductImage(models.Model):
    id = models.AutoField(primary_key=True, db_column='productimage_id')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image_url = models.URLField()
    class Meta:
        managed = False
        db_table = 'productimage'

class Address(models.Model):
    id = models.AutoField(primary_key=True, db_column='address_id')
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'address'

class User(models.Model):
    id = models.AutoField(primary_key=True, db_column='users_id')
    name = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.ForeignKey(Address, null=True, blank=True, on_delete=models.SET_NULL)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=50,default='customer')
    class Meta:
        managed = False
        db_table = 'user'

class ShoppingCart(models.Model):
    id = models.AutoField(primary_key=True, db_column='shoppingcart_id')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        managed = False
        db_table = 'shoppingcart'

class CartItem(models.Model):
    id = models.AutoField(primary_key=True, db_column='cartitem_id')
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    class Meta:
        managed = False
        db_table = 'cartitem'

class OrderStatus(models.Model):
    id = models.AutoField(primary_key=True, db_column='orderstatus_id')
    status_name = models.CharField(max_length=50)
    class Meta:
        managed = False
        db_table = 'orderstatus'

class Order(models.Model):
    id = models.AutoField(primary_key=True, db_column='order_id')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.ForeignKey(OrderStatus, on_delete=models.CASCADE)
    tracking_number = models.CharField(max_length=100, blank=True)
    shipping_address = models.ForeignKey(Address, null=True, blank=True, on_delete=models.SET_NULL)
    class Meta:
        managed = False
        db_table = 'order'

class OrderItem(models.Model):
    id = models.AutoField(primary_key=True, db_column='orderitem_id')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        managed = False
        db_table = 'orderitem'

class PaymentStatus(models.Model):
    id = models.AutoField(primary_key=True, db_column='paymentstatus_id')
    status_name = models.CharField(max_length=50)
    class Meta:
        managed = False
        db_table = 'paymentstatus'

class Payment(models.Model):
    id = models.AutoField(primary_key=True, db_column='payment_id')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.ForeignKey(PaymentStatus, on_delete=models.CASCADE)
    class Meta:
        managed = False
        db_table = 'payment'
