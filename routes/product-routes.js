const express = require("express");
const connection = require("../connection");
const router = express.Router();
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");

// GET all products
router.get("/", auth.authenticationToken, (req, res) => {
    const query = `
        SELECT p.*, c.name AS categoryName
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        ORDER BY p.name
    `;
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json({ message: "Failed to get products!" });
        }
    });
});

// POST create new product
router.post("/", auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const product = req.body;
    const query = `
        INSERT INTO products (name, categoryId, description, price, status)
        VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(
        query,
        [
            product.name,
            product.categoryId,
            product.description || null,
            product.price || 0,
            product.status || "active",
        ],
        (err, results) => {
            if (!err) {
                return res.status(201).json({ message: "Product added successfully." });
            } else {
                return res.status(500).json({ message: "Failed to add product!" });
            }
        }
    );
});

// PUT update product
router.put("/:id", auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const product = req.body;
    const { id } = req.params;
    const query = `
        UPDATE products
        SET name = ?, categoryId = ?, description = ?, price = ?, status = ?
        WHERE id = ?
    `;
    connection.query(
        query,
        [
            product.name,
            product.categoryId,
            product.description || null,
            product.price || 0,
            product.status || "active",
            id,
        ],
        (err, results) => {
            if (!err) {
                return res.status(200).json({ message: "Product updated successfully." });
            } else {
                return res.status(500).json({ message: "Failed to update product!" });
            }
        }
    );
});

// DELETE product
router.delete("/:id", auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM products WHERE id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Product deleted successfully." });
        } else {
            return res.status(500).json({ message: "Failed to delete product!" });
        }
    });
});

module.exports = router;
