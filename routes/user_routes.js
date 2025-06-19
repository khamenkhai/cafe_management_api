const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.post("/signup", (req, res) => {

    const user = req.body;

    const checkQuery = "SELECT email FROM users WHERE email = ?";
    connection.query(checkQuery, [user.email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const insertQuery = `
            INSERT INTO users (name, contactNumber, email, password, status, role)
            VALUES (?, ?, ?, ?, 'false', 'user')
        `;

        connection.query(insertQuery, [
            user.name,
            user.contactNumber,
            user.email,
            user.password,
            user.status || 'false',
            user.role || 'user'
        ], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Insert failed", error: err });
            }

            return res.status(201).json({ message: "User registered successfully" });
        });
    });
});

module.exports = router;
