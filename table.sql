CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250),
    contactNumber VARCHAR(20),
    email VARCHAR(50),
    password VARCHAR(250),
    status VARCHAR(20),
    role VARCHAR(20),
    UNIQUE (email)
);



CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250) NOT NULL
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250) NOT NULL,
    categoryId INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    description VARCHAR(255),
    price INTEGER,
    status VARCHAR(20)
);

-- CREATE TABLE bill_items (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     bill_id INT NOT NULL,
--     product_id INT NOT NULL,
--     quantity INT NOT NULL DEFAULT 1,
--     price INT NOT NULL,
--     FOREIGN KEY (bill_id) REFERENCES bill(id) ON DELETE CASCADE,
--     FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
-- );



CREATE TABLE bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(250) NOT NULL,
    name VARCHAR(250) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(255) NOT NULL,
    paymentMethod VARCHAR(255) NOT NULL,
    total INT NOT NULL,
    productDetails JSON DEFAULT NULL,
    createdBy VARCHAR(255)
);

