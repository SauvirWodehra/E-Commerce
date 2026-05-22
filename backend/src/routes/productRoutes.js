/**
 * Product Routes
 * 
 * Defines REST API endpoints for product and category operations.
 * 
 * Routes:
 *   GET /api/products          - List all products (with optional search & category filter)
 *   GET /api/products/:id      - Get a single product by ID
 *   GET /api/categories        - List all categories
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product endpoints
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// Category endpoints
router.get('/categories', productController.getCategories);

module.exports = router;
