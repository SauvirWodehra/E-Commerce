/**
 * Product Model
 * 
 * Encapsulates all database queries related to products and categories.
 * Uses raw SQL with parameterized queries for security (prevents SQL injection).
 */

const pool = require('../config/db');

/**
 * Fetches all products with optional search and category filtering.
 * Joins with categories table to include category name in results.
 * 
 * @param {string|null} search - Optional search term to filter products by name (ILIKE).
 * @param {string|null} categoryId - Optional category UUID to filter products.
 * @returns {Promise<Array>} Array of product objects.
 */
const getAllProducts = async (search = null, categoryId = null) => {
  let query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      p.rating,
      p.review_count,
      p.primary_image_url,
      p.specifications,
      p.created_at,
      c.id AS category_id,
      c.name AS category_name
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
  `;

  const conditions = [];
  const params = [];

  // Dynamic WHERE clause construction based on provided filters
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`p.name ILIKE $${params.length}`);
  }

  if (categoryId) {
    params.push(categoryId);
    conditions.push(`p.category_id = $${params.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY p.created_at DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};

/**
 * Fetches all categories from the database.
 * 
 * @returns {Promise<Array>} Array of category objects with id and name.
 */
const getCategories = async () => {
  const query = `SELECT id, name FROM categories ORDER BY name ASC`;
  const result = await pool.query(query);
  return result.rows;
};

/**
 * Fetches a single product by its ID, including its category and all images.
 * 
 * @param {string} productId - The UUID of the product.
 * @returns {Promise<Object|null>} Product object with images array, or null if not found.
 */
const getProductById = async (productId) => {
  // Fetch product details
  const productQuery = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      p.rating,
      p.review_count,
      p.primary_image_url,
      p.specifications,
      p.created_at,
      c.id AS category_id,
      c.name AS category_name
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `;
  const productResult = await pool.query(productQuery, [productId]);

  if (productResult.rows.length === 0) {
    return null;
  }

  // Fetch associated images for the carousel
  const imagesQuery = `
    SELECT id, image_url, display_order 
    FROM product_images 
    WHERE product_id = $1 
    ORDER BY display_order ASC
  `;
  const imagesResult = await pool.query(imagesQuery, [productId]);

  return {
    ...productResult.rows[0],
    images: imagesResult.rows,
  };
};

module.exports = {
  getAllProducts,
  getCategories,
  getProductById,
};
