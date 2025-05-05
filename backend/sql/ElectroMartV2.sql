/*

*/
CREATE TABLE brand (
    brand_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE category (
    category_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES category(category_id) ON DELETE CASCADE
); 

CREATE TABLE product (
    product_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    brand_id INT,
    category_id INT,
    FOREIGN KEY (brand_id) REFERENCES brand(brand_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

CREATE TABLE product_image (
    image_id INT PRIMARY KEY,
    product_id INT,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

CREATE TABLE city (
    city_id INT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    postal_code VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL
);

CREATE TABLE address (
    address_id INT PRIMARY KEY,
    address_line VARCHAR(255) NOT NULl,
    city_id INT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city(city_id) ON DELETE CASCADE
);

CREATE TABLE `user` (
    user_id INT PRIMARY KEY,
    username VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address INT,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'customer', /*admin, customer*/
    FOREIGN KEY (address) REFERENCES address(address_id) ON DELETE CASCADE
);

CREATE TABLE shopping_cart (
    cart_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
    cart_item_id INT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES shopping_cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

CREATE TABLE order_status (
    status_id INT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL /* PROCESSING, DELIVERED, CANCELLED */
);

CREATE TABLE `order` (
    order_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount INT NOT NULL, 
    order_status_id INT NOT NULL,
    tracking_number VARCHAR(100) NOT NULL,
    shipping_address_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_status_id) REFERENCES order_status (status_id) ON DELETE CASCADE,
    FOREIGN KEY (shipping_address_id) REFERENCES address (address_id) ON DELETE CASCADE
);

CREATE TABLE order_item (
    order_item_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NULL,
    quantity INT NOT NULL,
    price_per_unit INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES `order` (order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE
);

CREATE TABLE payment_status (
    payment_status_id INT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL /*COMPLETING, PENDING, FAILED*/
);

CREATE TABLE payment (
    payment_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES `order` (order_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_status_id) REFERENCES payment_status (payment_status_id) ON DELETE CASCADE
);