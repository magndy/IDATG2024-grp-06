/*
    Category
*/
create TABLE Category (
    categoryID  INT AUTO_INCREMENT,
    name        VARCHAR(50),
    description VARCHAR(100), 
    PRIMARY KEY (categoryID)
);
/*
    Brand 
*/
CREATE TABLE Brand (
    brandID     INT AUTO_INCREMENT,
    name        VARCHAR(50),
    description VARCHAR(50),
    PRIMARY KEY (brandID)
);
/*
    Product 
*/
CREATE TABLE Product (
    productID     INT AUTO_INCREMENT,    
    name          VARCHAR(50) NOT NULL,
    description   VARCHAR(50),
    price         INT         NOT NULL,
    stockQuantity VARCHAR(50) NOT NULL,
    brandID       INT,
    categoryID    INT         NOT NULL,
    PRIMARY KEY(productID),
    FOREIGN KEY(brandID) REFERENCES Brand(brandID) ON DELETE CASCADE
);


/*
    User
*/
CREATE TABLE User (
    userID     INT AUTO_INCREMENT,    
    username   VARCHAR(50) NOT NULL,
    password   VARCHAR(50) NOT NULL,
    firstName  VARCHAR(50) NOT NULL,
    lastName   VARCHAR(50) NOT NULL,
    address    VARCHAR(50) NOT NULL,
    PRIMARY KEY (userID)
);
/*
    Order 
    - a reserverd keyword in sql
*/
CREATE TABLE Orders (
    orderID     INT AUTO_INCREMENT,    
    userID      INT,    
    orderDate   DATETIME,    
    totalAmount INT,
    status      VARCHAR(50),
    PRIMARY KEY (orderID),
    FOREIGN KEY(userID) REFERENCES User(userID) ON DELETE CASCADE
);
/*
    Order Item 
*/
CREATE TABLE OrderItem (
    orderItemID   INT AUTO_INCREMENT,
    orderID       INT,
    productID     INT,
    quantity      INT,
    subtotal      INT,
    PRIMARY KEY (orderItemID),
    FOREIGN KEY(orderID) REFERENCES Orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY(productID) REFERENCES Product(productID) ON DELETE CASCADE
);

CREATE TABLE Payment (
    paymentID     INT AUTO_INCREMENT,
    orderID       INT,
    paymentMethod VARCHAR(50),
    amount        INT,
    paymentDate   DATETIME,
    status        VARCHAR(50),
    PRIMARY KEY (paymentID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE CASCADE
);

