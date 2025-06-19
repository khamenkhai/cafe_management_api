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


INSERT INTO users (name, contactNumber, email, password, status, role) 
VALUES ('admin', '1234567890', 'admin@gmail.com', 'password', 'active', 'admin');
