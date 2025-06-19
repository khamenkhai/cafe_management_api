const express = require("express");
const router = express.Router();
require("dotenv").config();
const connection = require("../connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
const nodemailer = require("nodemailer");

// SIGNUP ROUTE
router.post("/signup", (req, res) => {
    const user = req.body;

    const checkQuery = "SELECT email FROM users WHERE email = ?";
    connection.query(checkQuery, [user.email], async (err, results) => {
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

        try {
            const hashedPassword = await bcrypt.hash(user.password, 10); // ✅ Hash password

            connection.query(insertQuery, [
                user.name,
                user.contactNumber,
                user.email,
                hashedPassword, // ✅ Save hashed password
                user.status || 'false',
                user.role || 'user'
            ], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Insert failed", error: err });
                }

                return res.status(201).json({ message: "User registered successfully" });
            });
        } catch (hashErr) {
            return res.status(500).json({ message: "Password hashing failed", error: hashErr });
        }
    });
});

// LOGIN ROUTE
router.post("/login", (req, res) => {
    const user = req.body;
    const checkQuery = "SELECT email, password, role, status FROM users WHERE email=?";
    connection.query(checkQuery, [user.email], async (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                console.log(`-> Login attempt with email: ${user.email}`);
                return res.status(401).json({ message: "Incorrect username or password!" });
            }

            const isMatch = await bcrypt.compare(user.password, results[0].password); // ✅ Compare hashed

            if (!isMatch) {
                return res.status(401).json({ message: "Incorrect username or password!" });
            } else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Wait for admin approval!" });
            } else if (isMatch) {
                const response = { email: results[0].email, role: results[0].role };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken });
            } else {
                return res.status(500).json({ message: "Something went wrong!" });
            }
        } else {
            return res.status(500).json({ data: err });
        }
    });
});

module.exports = router;
