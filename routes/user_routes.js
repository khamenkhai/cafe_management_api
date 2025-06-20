const express = require("express");
const router = express.Router();
require("dotenv").config();
const connection = require("../connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const auth = require("../services/authentication");

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        password: process.env.PASSWORD,
    }
});


router.post("/forgetPassword", (req, res) => {
    const user = req.body;
    const checkQuery = "select email, password from users where email=?";
    connection.query(checkQuery, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "Password sent successfully to your email! " })
            } else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: "Password by Cafe Management System",
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #4CAF50;">Cafe Management System</h2>
                            <p>Hello,</p>
                            <p>You requested to retrieve your password. Here are your credentials:</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #ddd; margin: 15px 0;">
                            <p><strong>Email:</strong> ${results[0].email}</p>
                            <p><strong>Password:</strong> ${results[0].password}</p>
                            </div>
                            <p>For your security, we recommend changing your password after logging in.</p>
                            <p>Thank you,<br/>Cafe Management Team</p>
                        </div>
                        `}

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(`=> error : ${error}`)
                    } else {
                        console.log(`=> Email sent : ${info.response}`);
                    }
                });

                return res.status(200).json({ message: "Password was sent sucessfully to your email." })
            }
        } else {
            return res.status(500).json({ error: err })
        }
    })
});

router.get("/get", auth.authenticationToken,(req, res) => {
    var query = "select id,name,email,contactNumber,status from users where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json({ data: err })
        }
    })
});

router.put("/update/:id", (req, res) => {
    const userId = req.params.id;
    const { name, email, contactNumber, status } = req.body;

    const query = `
        UPDATE users
        SET name = ?, email = ?, contactNumber = ?, status = ?
        WHERE id = ?
    `;

    const values = [name, email, contactNumber, status, userId];

    connection.query(query, values, (err, result) => {
        if (!err) {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ message: "User updated successfully" });
        } else {
            return res.status(500).json({ error: err });
        }
    });
});




module.exports = router;
