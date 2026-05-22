/**
 * Product Controller
 * 
 * Handles HTTP request/response logic for product-related endpoints.
 * Delegates data operations to the product model layer.
 */

const productModel = require('../models/productModel');

/**
 * GET /api/products
 * Fetches all products with optional search and category filtering.
 * 
 * Query Parameters:
 *   - search (string): Filter products by name (partial, case-insensitive match).
 *   - category (string): Filter products by category UUID.
 */
const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    // Input validation: category must be a valid UUID format if provided
    if (category && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category ID format. Must be a valid UUID.',
      });
    }

    const products = await productModel.getAllProducts(
      search || null,
      category || null
    );

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories
 * Fetches all available product categories.
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await productModel.getCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Fetches a single product by its UUID, including associated images.
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Input validation: id must be a valid UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format. Must be a valid UUID.',
      });
    }

    const product = await productModel.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getCategories,
  getProductById,
};
