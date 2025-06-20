const express = require("express");
const connection = require("../connection");
const router = express.Router();
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

// GET all categories
router.get("/", auth.authenticationToken, (req, res) => {
    const query = "SELECT * FROM categories ORDER BY name";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json({ message: "Failed to get categories!" });
        }
    });
});

// POST create new category
router.post("/", auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const category = req.body;
    const query = "INSERT INTO categories (name) VALUES (?)";
    connection.query(query, [category.name], (err, results) => {
        if (!err) {
            return res.status(201).json({ message: "Category added successfully." });
        } else {
            return res.status(500).json({ message: "Failed to add category!" });
        }
    });
});

// PUT update category
router.put("/:id", auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const category = req.body;
    const { id } = req.params;
    const query = "UPDATE categories SET name = ? WHERE id = ?";
    connection.query(query, [category.name, id], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Category updated successfully." });
        } else {
            return res.status(500).json({ message: "Failed to update category!" });
        }
    });
});

// DELETE category
router.delete("/:id", auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM categories WHERE id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Category deleted successfully." });
        } else {
            return res.status(500).json({ message: "Failed to delete category!" });
        }
    });
});

module.exports = router;
