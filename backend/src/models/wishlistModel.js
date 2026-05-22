/**
 * Wishlist Model
 * 
 * DB-backed wishlist operations per user.
 */

const pool = require('../config/db');

/**
 * Gets all wishlisted products for a user.
 */
const getWishlistByUser = async (userId) => {
  const query = `
    SELECT 
      w.id AS wishlist_id,
      w.created_at AS wishlisted_at,
      p.id, p.name, p.description, p.price, p.stock_quantity,
      p.rating, p.review_count, p.primary_image_url,
      c.name AS category_name
    FROM wishlists w
    INNER JOIN products p ON w.product_id = p.id
    INNER JOIN categories c ON p.category_id = c.id
    WHERE w.user_id = $1
    ORDER BY w.created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

/**
 * Adds a product to the user's wishlist.
 */
const addToWishlist = async (userId, productId) => {
  const query = `
    INSERT INTO wishlists (user_id, product_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, product_id) DO NOTHING
    RETURNING *
  `;
  const result = await pool.query(query, [userId, productId]);
  return result.rows[0] || { user_id: userId, product_id: productId };
};

/**
 * Removes a product from the user's wishlist.
 */
const removeFromWishlist = async (userId, productId) => {
  await pool.query(
    'DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
  return true;
};

/**
 * Gets all wishlisted product IDs for a user (for quick lookup).
 */
const getWishlistIds = async (userId) => {
  const result = await pool.query(
    'SELECT product_id FROM wishlists WHERE user_id = $1',
    [userId]
  );
  return result.rows.map((r) => r.product_id);
};

module.exports = {
  getWishlistByUser,
  addToWishlist,
  removeFromWishlist,
  getWishlistIds,
};
