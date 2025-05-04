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

CREATE TABLE address (
    address_id INT PRIMARY KEY,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL
);

CREATE TABLE `user` (
    user_id INT PRIMARY KEY,
    name VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address_id INT,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer',
    FOREIGN KEY (address_id) REFERENCES address(address_id) ON DELETE CASCADE
);

CREATE TABLE shopping_cart (
    cart_id INT PRIMARY KEY,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
    cart_item_id INT PRIMARY KEY,
    cart_id INT,
    product_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES shopping_cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

CREATE TABLE order_status (
    status_id INT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL
);

CREATE TABLE `order` (
    order_id INT PRIMARY KEY,
    user_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount INT NOT NULL, 
    order_status_id INT,
    tracking_number VARCHAR(100),
    shipping_address_id INT,
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
    subtotal INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES `order` (order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE
);

CREATE TABLE payment_status (
    payment_status_id INT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL
);

CREATE TABLE payment (
    payment_id INT PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status_id INT,
    FOREIGN KEY (order_id) REFERENCES `order` (order_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_status_id) REFERENCES payment_status (payment_status_id) ON DELETE CASCADE
);