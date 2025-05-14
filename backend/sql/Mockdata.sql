INSERT INTO brand (brand_id, name, description) VALUES
(1, 'Apple', 'Premium brand offering smartphones, laptops, and accessories.'),
(2, 'Samsung', 'Diverse electronics company known for phones, TVs, and appliances.'),
(3, 'Sony', 'Global leader in audio, video, and imaging technologies.'),
(4, 'Dell', 'Well-known for reliable PCs, laptops, and monitors.'),
(5, 'HP', 'Offers computers, printers, and related accessories for personal and business use.');


INSERT INTO category (category_id, name, description, parent_id) VALUES
(1, 'Electronics', 'All kinds of electronic devices and gadgets.', NULL),
(2, 'Smartphones', 'Mobile phones from various brands.', 1),
(3, 'Laptops', 'Portable computers for work and gaming.', 1),
(4, 'Cameras', 'Digital and DSLR cameras for photography.', 1),
(5, 'Accessories', 'Electronic accessories like chargers, cases, etc.', 1);

INSERT INTO product (product_id, name, description, price, stock_quantity, brand_id, category_id) VALUES
(1, 'iPhone 14 Pro', 'Apple smartphone with advanced camera and A16 chip.', 1199.00, 25, 1, 2),
(2, 'Samsung Galaxy S23', 'Flagship Android phone with powerful performance.', 999.99, 30, 2, 2),
(3, 'Dell XPS 13', 'Compact and powerful ultrabook laptop.', 1299.50, 15, 4, 3),
(4, 'Sony Alpha A7 III', 'Full-frame mirrorless camera ideal for professionals.', 1999.99, 10, 3, 4),
(5, 'HP USB-C Dock', 'Docking station for laptops with multiple ports.', 149.00, 50, 5, 5);


INSERT INTO product_image (image_id, product_id, image_url) VALUES
(1, 1, 'https://media.power-cdn.net/images/h-c0c81089a6d405be3eec3533e1739ffc/products/3614193/3614193_12_1200x1200_t_g.webp'),
(2, 2, 'https://www.komplett.no/img/p/2272/1302902.jpg?view=gallery&orientation=horizontal'),
(3, 3, 'https://www.komplett.no/img/p/1200/1313997.jpg'),
(4, 4, 'https://pricespy-75b8.kxcdn.com/product/standard/280/4703156.jpg'),
(5, 5, 'https://cf-images.dustin.eu/cdn-cgi/image/fit=contain,format=auto,quality=75,width=828,fit=contain/image/d2000010011307324/hp-usb-c-dock-g5-usb-32-gen-1-31-gen-1-type-c.jpeg');

INSERT INTO city (city_id, city_name, postal_code, country) VALUES
(1, 'Oslo', '0150', 'Norway'),
(2, 'Bergen', '5003', 'Norway'),
(3, 'Stockholm', '11120', 'Sweden'),
(4, 'Copenhagen', '1050', 'Denmark'),
(5, 'Helsinki', '00100', 'Finland');

INSERT INTO address (address_id, address_line, city_id) VALUES
(1, 'Karl Johans gate 15', 1),
(2, 'Bryggen 5', 2),
(3, 'Drottninggatan 20', 3),
(4, 'Nyhavn 17', 4),
(5, 'Mannerheimintie 10', 5);

INSERT INTO `user` (user_id, username, first_name, last_name, email, password, address, phone, role) VALUES
(1, 'jdoe', 'John', 'Doe', 'jdoe@example.com', 'hashed_password_1', 1, '+4712345678', 'customer'),
(2, 'annab', 'Anna', 'Berg', 'anna.berg@example.com', 'hashed_password_2', 2, '+4798765432', 'customer'),
(3, 'karlsson', 'Karl', 'Karlsson', 'karl.k@example.com', 'hashed_password_3', 3, '+46701112233', 'customer'),
(4, 'adminuser', 'Vinjar', 'Berland', 'admin@example.com', 'hashed_password_4', 4, '+4522334455', 'admin'),
(5, 'mlehto', 'Maria', 'Lehto', 'maria.lehto@example.com', 'hashed_password_5', 5, '+358401234567', 'customer');

INSERT INTO shopping_cart (cart_id, user_id, updated_at) VALUES
(1, 1, '2025-05-05 14:30:00'), -- John Doe
(2, 2, '2025-05-05 15:10:00'), -- Anna Berg
(3, 3, '2025-05-04 18:45:00'), -- Karl Karlsson
(4, 4, '2025-05-03 12:00:00'), -- Vinjar Berland (admin)
(5, 5, '2025-05-05 09:20:00'); -- Maria Lehto


INSERT INTO cart_item (cart_item_id, cart_id, product_id) VALUES
(1, 1, 1), -- iPhone 14 Pro in John Doe's cart
(2, 1, 5), -- HP Dock in John Doe's cart
(3, 2, 2), -- Galaxy S23 in Anna Berg's cart
(4, 3, 3), -- Dell XPS 13 in Karl Karlsson's cart
(5, 5, 4); -- Sony A7 III in Maria Lehto's cart

INSERT INTO order_status (status_id, status_name) VALUES
(1, 'PROCESSING'),
(2, 'DELIVERED'),
(3, 'CANCELLED');

INSERT INTO `order` (order_id, user_id, order_date, total_amount, order_status_id, tracking_number, shipping_address_id) VALUES
(1, 1, '2025-05-01 12:30:00', 1348, 2, 'TRK123456NO', 1),
(2, 2, '2025-05-02 15:00:00', 999, 1, 'TRK223456NO', 2),
(3, 3, '2025-05-03 10:15:00', 1299, 2, 'TRK323456SE', 3),
(4, 4, '2025-05-04 09:45:00', 1999, 3, 'TRK423456DK', 4),
(5, 5, '2025-05-05 11:20:00', 149, 1, 'TRK523456FI', 5);

INSERT INTO order_item (order_item_id, order_id, product_id, quantity, price_per_unit) VALUES
(1, 1, 1, 1, 1199),  -- iPhone 14 Pro in Order 1
(2, 1, 5, 1, 149),   -- HP Dock in Order 1
(3, 2, 2, 1, 999),   -- Galaxy S23 in Order 2
(4, 3, 3, 1, 1299),  -- Dell XPS 13 in Order 3
(5, 4, 4, 1, 1999);  -- Sony A7 III in Order 4

INSERT INTO payment_status (payment_status_id, status_name) VALUES
(1, 'COMPLETING'),
(2, 'PENDING'),
(3, 'FAILED');

INSERT INTO payment (payment_id, order_id, payment_method, amount, payment_date, payment_status_id) VALUES
(1, 1, 'Credit Card', 1348.00, '2025-05-01 13:00:00', 1),  -- COMPLETING
(2, 2, 'PayPal', 999.00, '2025-05-02 15:10:00', 2),        -- PENDING
(3, 3, 'Credit Card', 1299.00, '2025-05-03 10:30:00', 1),  -- COMPLETING
(4, 4, 'Bank Transfer', 1999.00, '2025-05-04 10:00:00', 3),-- FAILED
(5, 5, 'Credit Card', 149.00, '2025-05-05 11:30:00', 2);   -- PENDING
