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
    is_active = models.BooleanField(default=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, db_column='brand_id', null=True)  # Added db_column and null=True
    category = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='category_id', null=True)  # Added db_column and null=True
    class Meta:
        managed = False
        db_table = 'product'

class ProductImage(models.Model):
    id = models.AutoField(primary_key=True, db_column='image_id')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image_url = models.URLField()
    class Meta:
        managed = False
        db_table = 'product_image'

class City(models.Model):
    id = models.AutoField(primary_key=True, db_column='city_id')
    city_name = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'city'


class Address(models.Model):
    id = models.AutoField(primary_key=True, db_column='address_id')
    address_line = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE, db_column='city_id', null=True)
    class Meta:
        managed = False
        db_table = 'address'

class User(models.Model):
    id = models.AutoField(primary_key=True, db_column='user_id')
    username = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    address = models.ForeignKey(Address, null=True, blank=True,db_column='address', on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=50,default='customer')
    class Meta:
        managed = False
        db_table = 'user'

class ShoppingCart(models.Model):
    id = models.AutoField(primary_key=True, db_column='cart_id')
    user = models.ForeignKey(User,db_column='user_id',on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        managed = False
        db_table = 'shopping_cart'

class CartItem(models.Model):
    id = models.AutoField(primary_key=True, db_column='cart_item_id')
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    class Meta:
        managed = False
        db_table = 'cart_item'

class OrderStatus(models.Model):
    id = models.AutoField(primary_key=True, db_column='status_id')
    status_name = models.CharField(max_length=50)
    class Meta:
        managed = False
        db_table = 'order_status'

class Order(models.Model):
    id = models.AutoField(primary_key=True, db_column='order_id')
    user = models.ForeignKey(User,db_column='user_id', on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.ForeignKey(OrderStatus, on_delete=models.CASCADE)
    tracking_number = models.CharField(max_length=100, blank=True)
    shipping_address = models.ForeignKey(Address,db_column='shipping_address_id',null=True, blank=True, on_delete=models.CASCADE)
    class Meta:
        managed = False
        db_table = 'order'

class OrderItem(models.Model):
    id = models.AutoField(primary_key=True, db_column='order_item_id')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Is calculated from quantity and price_per_unit
    @property
    def subtotal(self):
        return self.quantity * self.price_per_unit
    
    class Meta:
        managed = False
        db_table = 'order_item'

class PaymentStatus(models.Model):
    id = models.AutoField(primary_key=True, db_column='payment_status_id')
    status_name = models.CharField(max_length=50)
    class Meta:
        managed = False
        db_table = 'payment_status'

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